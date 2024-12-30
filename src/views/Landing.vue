<template>
  <div class="landing">
    <md-card class="landing-card">
      <md-card-header>
        <div class="md-title">{{ $t('landing.welcome') }}</div>
      </md-card-header>
      <md-card-content>
        <p>{{ $t('landing.description') }}</p>
        <md-button class="md-primary md-raised" @click="$router.push('/login')">
          {{ $t('landing.getStarted') }}
        </md-button>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
export default {
  name: 'Landing'
}
</script>

<style lang="scss" scoped>
.landing {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;

  .landing-card {
    max-width: 600px;
    width: 100%;
  }
}
</style>