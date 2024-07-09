<script setup lang="ts">
const menu = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    href: "/",
    label: "Explore",
  },
  {
    href: "/dashboard/quiz",
    label: "Quiz",
  },
  {
    href: "/dashboard/contest",
    label: "Contest",
  },
];
</script>

<template>
  <!-- start sidebar -->
  <div id="sideBar">
    <!-- sidebar content -->
    <div class="flex flex-col justify-start">
      <!-- sidebar toggle -->
      <div class="text-right hidden md:block mb-4">
        <button id="sideBarHideBtn">
          <i class="fad fa-times-circle"></i>
        </button>
      </div>
      <!-- end sidebar toggle -->

      <p class="uppercase text-xs text-gray-600 mb-4 tracking-wider"></p>
      <a
        v-for="item in menu"
        class="mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500"
        :href="item.href"
        :key="item.href"
      >
        <i class="fad fa-chart-pie text-xs mr-2"></i>
        {{ item.label }}
      </a>
    </div>
    <!-- end sidebar content -->
  </div>
  <!-- end sidbar -->
</template>
