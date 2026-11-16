(function () {
  "use strict";

  const controls = new WeakMap();
  let nextId = 0;
  let active = null;
  let refreshQueued = false;
  let search = "";
  let searchTimer = null;

  function labelFor(select) {
    if (select.getAttribute("aria-label")) return select.getAttribute("aria-label");
    const labels = Array.from(select.labels || []);
    return labels.map(function (label) {
      const copy = label.cloneNode(true);
      copy.querySelectorAll("select, input, textarea, button, .select-menu, .guild-layer-description").forEach(function (node) {
        node.remove();
      });
      return copy.textContent.trim().replace(/\s+/g, " ");
    }).filter(Boolean).join(" ");
  }

  function optionsFor(select) {
    return Array.from(select.options).filter(function (option) {
      return !option.hidden && !(option.parentElement.tagName === "OPTGROUP" && option.parentElement.hidden);
    });
  }

  function optionDisabled(option) {
    return option.disabled || (option.parentElement.tagName === "OPTGROUP" && option.parentElement.disabled);
  }

  function refreshControl(control) {
    const select = control.select;
    const option = select.selectedOptions[0];
    const value = option ? option.textContent.trim() : "";
    const label = labelFor(select);
    control.text.textContent = value || "Choose an option";
    control.button.setAttribute("aria-label", label ? label + ": " + (value || "Choose an option") : value || "Choose an option");
    control.button.disabled = select.matches(":disabled");
    control.button.setAttribute("aria-required", select.required ? "true" : "false");
    const description = select.getAttribute("aria-describedby");
    if (description) control.button.setAttribute("aria-describedby", description);
    else control.button.removeAttribute("aria-describedby");
    if (select.validity.valid) {
      control.error.hidden = true;
      control.button.removeAttribute("aria-invalid");
    }
  }

  function refresh() {
    if (active && !active.select.isConnected) closeMenu(false);
    document.querySelectorAll("select.native-select-enhanced").forEach(function (select) {
      const control = controls.get(select);
      if (control) refreshControl(control);
    });
  }

  function queueRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    window.queueMicrotask(function () {
      refreshQueued = false;
      refresh();
    });
  }

  function positionMenu(control) {
    const rect = control.button.getBoundingClientRect();
    if (!rect.width || !rect.height || rect.bottom <= 0 || rect.top >= window.innerHeight ||
        rect.right <= 0 || rect.left >= window.innerWidth) {
      closeMenu(false);
      return;
    }
    const margin = 8;
    const gap = 4;
    const below = Math.max(0, window.innerHeight - rect.bottom - margin - gap);
    const above = Math.max(0, rect.top - margin - gap);
    const openAbove = below < 160 && above > below;
    const available = openAbove ? above : below;
    const width = Math.min(rect.width, window.innerWidth - margin * 2);
    control.list.style.width = width + "px";
    control.list.style.left = Math.max(margin, Math.min(rect.left, window.innerWidth - margin - width)) + "px";
    control.list.style.maxHeight = Math.min(256, available) + "px";
    control.list.style.top = "0px";
    const height = control.list.getBoundingClientRect().height;
    control.list.style.top = (openAbove ? rect.top - gap - height : rect.bottom + gap) + "px";
  }

  function setActiveOption(control, index) {
    if (index < 0 || !control.items[index] || optionDisabled(control.items[index].option)) return;
    if (control.activeIndex >= 0 && control.items[control.activeIndex]) {
      control.items[control.activeIndex].node.classList.remove("is-active");
    }
    control.activeIndex = index;
    const node = control.items[index].node;
    node.classList.add("is-active");
    control.button.setAttribute("aria-activedescendant", node.id);
    const top = node.offsetTop;
    const bottom = top + node.offsetHeight;
    if (top < control.list.scrollTop) control.list.scrollTop = top;
    else if (bottom > control.list.scrollTop + control.list.clientHeight) {
      control.list.scrollTop = bottom - control.list.clientHeight;
    }
  }

  function moveActive(control, direction, edge) {
    let index = edge === "first" ? -1 : edge === "last" ? control.items.length : control.activeIndex;
    while (true) {
      index += direction;
      if (index < 0 || index >= control.items.length) return;
      if (!optionDisabled(control.items[index].option)) {
        setActiveOption(control, index);
        return;
      }
    }
  }

  function closeMenu(restoreFocus) {
    if (!active) return;
    const control = active;
    active = null;
    control.button.setAttribute("aria-expanded", "false");
    control.button.removeAttribute("aria-activedescendant");
    control.button.removeAttribute("aria-controls");
    control.list.remove();
    control.items = [];
    control.activeIndex = -1;
    search = "";
    window.clearTimeout(searchTimer);
    if (restoreFocus && control.button.isConnected) control.button.focus({ preventScroll: true });
  }

  function selectOption(control, index) {
    const item = control.items[index];
    if (!item || optionDisabled(item.option)) return;
    const changed = control.select.selectedIndex !== item.option.index;
    control.select.selectedIndex = item.option.index;
    closeMenu(true);
    refreshControl(control);
    if (changed) {
      control.select.dispatchEvent(new Event("input", { bubbles: true }));
      control.select.dispatchEvent(new Event("change", { bubbles: true }));
    }
    queueRefresh();
  }

  function openMenu(control) {
    if (control.select.matches(":disabled")) return;
    closeMenu(false);
    refreshControl(control);
    control.items = [];
    control.activeIndex = -1;
    control.list.replaceChildren();
    control.list.setAttribute("aria-label", labelFor(control.select) || "Options");
    let lastGroup = null;
    let groupContainer = null;
    optionsFor(control.select).forEach(function (option) {
      const group = option.parentElement.tagName === "OPTGROUP" ? option.parentElement : null;
      if (group !== lastGroup) {
        groupContainer = null;
        if (group) {
          groupContainer = document.createElement("div");
          groupContainer.setAttribute("role", "group");
          groupContainer.setAttribute("aria-label", group.label);
          const heading = document.createElement("div");
          heading.className = "select-menu-group";
          heading.textContent = group.label;
          heading.setAttribute("aria-hidden", "true");
          groupContainer.appendChild(heading);
          control.list.appendChild(groupContainer);
        }
      }
      lastGroup = group;
      const node = document.createElement("div");
      const index = control.items.length;
      node.id = control.list.id + "-option-" + index;
      node.className = "select-menu-option";
      node.setAttribute("role", "option");
      node.setAttribute("aria-selected", option.selected ? "true" : "false");
      if (optionDisabled(option)) node.setAttribute("aria-disabled", "true");
      node.textContent = option.textContent.trim();
      node.addEventListener("click", function () { selectOption(control, index); });
      control.items.push({ option: option, node: node });
      (groupContainer || control.list).appendChild(node);
    });
    document.body.appendChild(control.list);
    active = control;
    control.button.setAttribute("aria-controls", control.list.id);
    control.button.setAttribute("aria-expanded", "true");
    control.list.style.font = window.getComputedStyle(control.button).font;
    positionMenu(control);
    if (active !== control) return;
    const selected = control.items.findIndex(function (item) { return item.option.selected && !optionDisabled(item.option); });
    if (selected >= 0) setActiveOption(control, selected);
    else moveActive(control, 1, "first");
  }

  function onKeydown(control, event) {
    const isOpen = active === control;
    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      event.stopPropagation();
      closeMenu(true);
    } else if (event.key === "Tab" && isOpen) {
      closeMenu(false);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen) selectOption(control, control.activeIndex);
      else openMenu(control);
    } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (!isOpen) openMenu(control);
      else if (event.key === "Home") moveActive(control, 1, "first");
      else if (event.key === "End") moveActive(control, -1, "last");
      else moveActive(control, event.key === "ArrowDown" ? 1 : -1);
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      if (!isOpen) openMenu(control);
      if (active !== control) return;
      search += event.key.toLocaleLowerCase();
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(function () { search = ""; }, 700);
      const index = control.items.findIndex(function (item) {
        return !optionDisabled(item.option) && item.option.textContent.trim().toLocaleLowerCase().startsWith(search);
      });
      if (index >= 0) setActiveOption(control, index);
    }
  }

  function enhance(root) {
    root.querySelectorAll("select:not([multiple])").forEach(function (select) {
      if (controls.has(select)) return;
      const wrapper = document.createElement("span");
      wrapper.className = "select-menu";
      const button = document.createElement("button");
      button.type = "button";
      button.className = "select-menu-trigger";
      button.setAttribute("role", "combobox");
      button.setAttribute("aria-haspopup", "listbox");
      button.setAttribute("aria-expanded", "false");
      button.style.font = window.getComputedStyle(select).font;
      const text = document.createElement("span");
      text.className = "select-menu-value";
      const arrow = document.createElement("span");
      arrow.className = "select-menu-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "▾";
      button.append(text, arrow);
      const error = document.createElement("span");
      error.className = "select-menu-error";
      error.setAttribute("role", "alert");
      error.textContent = "Choose an option.";
      error.hidden = true;
      wrapper.append(button, error);
      const list = document.createElement("div");
      list.className = "select-menu-list";
      list.id = "select-menu-list-" + (++nextId);
      list.setAttribute("role", "listbox");
      const control = { select: select, button: button, text: text, error: error, list: list, items: [], activeIndex: -1 };
      select.insertAdjacentElement("afterend", wrapper);
      controls.set(select, control);
      select.classList.add("native-select-enhanced");
      select.setAttribute("aria-hidden", "true");
      select.tabIndex = -1;
      button.addEventListener("click", function () {
        if (active === control) closeMenu(true);
        else openMenu(control);
      });
      button.addEventListener("keydown", function (event) { onKeydown(control, event); });
      select.addEventListener("focus", function () {
        window.queueMicrotask(function () {
          if (document.activeElement === select) button.focus({ preventScroll: true });
        });
      });
      select.addEventListener("click", function (event) {
        event.preventDefault();
        window.queueMicrotask(function () { button.focus({ preventScroll: true }); });
      });
      select.addEventListener("invalid", function (event) {
        event.preventDefault();
        button.setAttribute("aria-invalid", "true");
        error.hidden = false;
        button.focus();
      });
      new MutationObserver(queueRefresh).observe(select, { childList: true, subtree: true, attributes: true, characterData: true });
      refreshControl(control);
    });
  }

  function focus(select) {
    const control = controls.get(select);
    (control ? control.button : select).focus({ preventScroll: true });
  }

  document.addEventListener("pointerdown", function (event) {
    if (active && !active.button.contains(event.target) && !active.list.contains(event.target)) closeMenu(false);
  });
  document.addEventListener("focusin", function (event) {
    if (active && !active.button.contains(event.target) && !active.list.contains(event.target)) closeMenu(false);
  });
  ["click", "change", "input", "reset", "pointerup", "keyup"].forEach(function (type) {
    document.addEventListener(type, queueRefresh);
  });
  document.addEventListener("scroll", function (event) {
    if (active && event.target !== active.list && !active.list.contains(event.target)) positionMenu(active);
  }, true);
  window.addEventListener("resize", function () { if (active) positionMenu(active); });

  window.TerraFormaSelectMenus = { enhance: enhance, focus: focus };
})();
