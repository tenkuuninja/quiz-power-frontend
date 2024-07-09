<script>
definePageMeta({
  layout: "dashboard",
});
</script>

<script setup></script>

<template>
  <!-- General Report -->
  @include('./index/generalReport.html')
  <!-- End General Report -->

  <!-- strat Analytics -->
  @include('./index/analytics-1.html')
  <!-- end Analytics -->

  <!-- Sales Overview -->
  @include('./index/salesOverview.html')
  <!-- end Sales Overview -->

  <!-- start numbers -->
  @include('./index/numbers.html')
  <!-- end nmbers -->

  <!-- start quick Info -->
  @include('./index/quickInfo.html')
  <!-- end quick Info -->
</template>
