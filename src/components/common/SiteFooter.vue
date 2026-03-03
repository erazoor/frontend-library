<template>
  <footer class="footer">
    <div class="footer__inner">
      <span class="footer__label">A project by</span>
      <a
        href="https://pierregineste.dev"
        target="_blank"
        rel="noopener noreferrer"
        class="footer__link"
      >
        Pierre Gineste
      </a>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  border-top: 1px solid $color-border;
  padding: $space-xl 0;
}

.footer__inner {
  @include container;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-sm;
}

.footer__label {
  font-size: $font-size-sm;
  color: $color-text-muted;
}

.footer__link {
  font-family: $font-mono;
  font-size: $font-size-sm;
  color: $color-text-secondary;
  transition: color $duration-fast $ease-out-expo;

  @include hover {
    color: $color-accent;
  }
}
</style>
