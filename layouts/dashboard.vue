<template>
  <DashboardLayoutNavBar></DashboardLayoutNavBar>
  <div
    class="md:fixed left-0 h-[calc(100vh-80px)] top-[80px] w-[240px] md:z-20 bg-white p-6 border-r border-gray-300"
  >
    <DashboardLayoutSideBar />
  </div>
  <div class="pl-[240px] mt-[80px]">
    <div class="bg-gray-100 min-h-[calc(100vh-80px)] p-[20px]">
      <slot />
    </div>
  </div>
</template>
