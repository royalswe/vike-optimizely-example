<template>
  <footer class="bg-dark text-light text-center text-md-left ">
    <div class="container">
      <div class="row pt-4">
        <div class="col-sm-6 col-md-3 pb-4">
          <h4 class="mb-4">
            Services
          </h4>
          <ul class="list-unstyled">
            <li>
              <a href="#" class="text-light">Web design</a>
            </li>
            <li>
              <a href="#" class="text-light">Development</a>
            </li>
            <li>
              <a href="#" class="text-light">Hosting</a>
            </li>
          </ul>
        </div>
        <div class="col-sm-6 col-md-3 pb-4">
          <h4 class="mb-4">
            About
          </h4>
          <ul class="list-unstyled">
            <li>
              <a href="#" class="text-light">Company</a>
            </li>
            <li>
              <a href="#" class="text-light">Team</a>
            </li>
            <li>
              <a href="#" class="text-light">Careers</a>
            </li>
          </ul>
        </div>
        <div class="col-md-6 pb-4">
          <h4 class="mb-4">
            Webb development
          </h4>
          <ul class="list-unstyled">
            <li>
              <a href="https://vike.dev/" class="text-light">vike.dev</a>
            </li>
            <li>
              <a href="https://www.optimizely.com" class="text-light">optimizely.com</a>
            </li>
            <li>
              <a href="https://vuejs.org/" class="text-light">vuejs.org</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="col d-flex justify-content-center mb-4">
        <a class="colorize-on-hover decolorize-6" href="https://discord.com/invite/hfHhnJyVg8"
          style="padding:3px;display:inline-block;line-height:0"><img src="https://vike.dev/assets/discord-JD33TUSF.svg"
            height="20"></a>
        <a class="colorize-on-hover decolorize-7" href="https://twitter.com/brillout"
          style="padding:3px;display:inline-block;line-height:0"><img src="https://vike.dev/assets/twitter-I7DXDN3J.svg"
            height="20"></a>
        <a class="colorize-on-hover decolorize-4" href="https://github.com/vikejs/vike"
          style="padding:3px;display:inline-block;line-height:0"><img src="https://vike.dev/assets/github-P5ZSKN2N.svg"
            height="20"></a>
        <a href="https://github.com/vikejs/vike/blob/main/CHANGELOG.md" class="button colorize-on-hover"
          style="display:flex;align-items:center;padding:1px 7px;margin-left:2px;font-size:0.97em;color:inherit"><span
            id="version-number" class="decolorize-7">v<!-- -->0.4.153</span><img class="decolorize-6"
            src="https://vike.dev/assets/changelog-IPI5F42D.svg" height="16" style="margin-left:5px"></a>
      </div>
    </div>
    <p class="text-center text-secondary border-top border-secondary py-4">
      {{ dayjs().format('YYYY MMMM DD') }} Vike </p>
  </footer>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
</script>

