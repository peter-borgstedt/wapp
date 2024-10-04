<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import Icon from "$lib/components/Icon.svelte";
  import { goto } from "$app/navigation";

  interface MenuItem {
    icon: any;
    title: string;
    items?: MenuItem[];
    route?: string;
  }

  let currentMenu: MenuItem = {
    icon: "gear",
    title: "Settings",
    items: [
      {
        icon: "user",
        title: "Profile",
        items: [
          {
            icon: "pencil",
            title: "Edit Profile",
            route: "/settings/profile/edit",
          },
          {
            icon: "key",
            title: "Change Password",
            route: "/settings/profile/password",
          },
        ],
      },
      {
        icon: "bell",
        title: "Notifications",
        items: [
          {
            icon: "envelope",
            title: "Email Notifications",
            route: "/settings/notifications/email",
          },
          {
            icon: "device-mobile",
            title: "Push Notifications",
            items: [
              {
                icon: "bell",
                title: "Enable/Disable",
                route: "/settings/notifications/push/toggle",
              },
              {
                icon: "sliders",
                title: "Customize",
                route: "/settings/notifications/push/customize",
              },
            ],
          },
        ],
      },
      { icon: "shield", title: "Privacy", route: "/settings/privacy" },
    ],
  };

  let isNavigatingForward = true;
  let menuHistory: MenuItem[] = [currentMenu];

  function navigateToSubMenu(item: MenuItem) {
    if (item.items) {
      isNavigatingForward = true;
      menuHistory = [...menuHistory, item];
      currentMenu = item;
    }
  }

  function goBack() {
    if (menuHistory.length > 1) {
      isNavigatingForward = false;
      menuHistory = menuHistory.slice(0, -1);
      currentMenu = menuHistory[menuHistory.length - 1];
    }
  }
</script>

<div class="menu-container">
  <div style="display: flex; flex-direction: column; align-items: flex-start; justify-content: center; height: 65px;">
    <button class="menu-header" onclick={() => {
      console.log(menuHistory);
      if (menuHistory.length > 1) {
        goBack();
      } else {
        goto("/");
      }
    }}>
      <span class="left-icon">
        <Icon type="regular" name="caret-left" size="xs" />
      </span>

      <span class="column title" style="position: relative;">
        <span style="position: absolute;" transition:fade={{ duration: 150 }}>
          {menuHistory.length > 1 ? currentMenu.title : "Settings"}
        </span>
      </span>
    </button>
  </div>

  <div class="menu-content">
    {#key currentMenu.title}
      <ul class="menu-list"
        in:fly={{
          x: isNavigatingForward ? "100%" : "-100%",
          duration: 350,
          opacity: 1,
        }}
        out:fly={{
          x: isNavigatingForward ? "-100%" : "100%",
          duration: 350,
          opacity: 1,
        }}
      >
        {#each currentMenu.items ?? [] as item (item.title)}
          <li class="menu-item">
            <button class="menu-item-content" onclick={() => item.items?.length ? navigateToSubMenu(item) : undefined}>
              <span class="left-icon">
                <Icon type="regular" name={item.icon} size="xs" />
              </span>
              <span class="column title">{item.title}</span>

              {#if item.items?.length}
                <Icon type="regular" name="caret-right" size="xs" />
              {/if}
            </button>
          </li>
        {/each}
      </ul>
    {/key}
  </div>
</div>

<style>
  .menu-container {
    display: flex;
    flex-direction: column;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    background: #f9f9f9;
    padding-top: env(safe-area-inset-top);
  }

  .menu-content {
    display: flex;
    position: relative;
    flex-direction: column;
  }

  .menu-list {
    position: absolute;
    list-style-type: none;
    width: 100%;
    padding: 0;
    margin: 0;
    background: white;
  }

  .menu-item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    height: 65px;
  }

  .menu-header,
  .menu-item-content {
    flex: 1;
    display: flex;
    background-color: transparent;
    border: none;
    _padding: 15px 10px;
    cursor: pointer;
  }

  .menu-header {
    flex: 0;
    border-bottom: 1px solid #eee;
    background-color: #f9f9f9;
  }

  .column {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .left-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 10px 0 10px;
  }

  .title {
    flex: 1;
  }
</style>
