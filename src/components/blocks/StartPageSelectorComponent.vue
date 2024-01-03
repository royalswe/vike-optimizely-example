<template>
  <!-- rewrite this file so it fits <Teleport> -->
  <div class="c-modal is-open" role="dialog" aria-modal="true">
    <!-- is-open is temporary for now, is-open should not exist in our new modal anymore  -->
    <!-- do not forget to play araound with tabs and se if tabindex is correct -->
    <div class="c-modal__dialog c-modal__dialog--lg">
      <div v-click-outside="clickedOutside" class="c-modal__content">
        <div class="c-modal__header">
          <div class="c-modal__close" @click="$emit('close')"><span
              class="material-icons c-modal__close__icon">close</span>
          </div>
          <label class="c-modal__title u-truncate">
            {{ t('common.selectstartpagemodal.header') }}
          </label>
        </div>
        <div class="c-modal__body">
          <p>
            {{ t('common.selectstartpagemodal.text') }}
          </p>
          <div class="c-selection-list c-selection-list--light-grey mb-4">
            <div v-for="(startPage, index) in pageContext.siteSettings.startPageSelectionList" :key="index"
              class="c-selection-list__item">
              <label :title="startPage.title ?? startPage.text" class="o-radio">
                <input type="radio" class="start-page-selector-list-input" name="startPageSelectorListInput"
                  :value="startPage.href" :checked="selectedStartPageUrl == startPage.href"
                  @change="updateSelected(startPage.href)" />
                <span class="o-radio__checkmark"></span>
                {{ startPage.title ?? startPage.text }}
              </label>
            </div>
          </div>
        </div>
        <div class="c-modal__footer">
          <button type="button" class="o-button o-button--black"
            :disabled="!cookieService.userConsentsToFunctionalCookies() || !selectedStartPageUrl"
            @click.prevent="saveStartPageSettings(false)">
            {{ t('common.selectstartpagemodal.savesettings') }}
          </button>
          <button type="button" class="o-button me-3" @click.prevent="saveStartPageSettings(true)">
            {{ t('common.selectstartpagemodal.removesettings') }}
          </button>
          <!-- Show feedback that cookies must be accepted to save -->
          <label class="o-feedback o-feedback--invalid" v-if="!cookieService.userConsentsToFunctionalCookies()">
            {{ t('common.selectstartpagemodal.acceptcookies') }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import cookieName from "#src/constants/cookieName";
import { TimeUnit } from "#src/constants/timeUnit";
import cookieService from "#src/services/cookieService";
import { usePageContext } from '#src/renderer/usePageContext';
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const emit = defineEmits(['close'])
// Hacky fix: have to check if event is triggered, otherwise it will execute and close the modal when open
const clickedOutside = (event: Event) => event && emit('close');

const { t } = useI18n();
const pageContext = usePageContext();
const selectedStartPageUrl = ref(cookieService.getCookie(cookieName.SelectedStartPageUrl));

const updateSelected = (value: any) => {
  selectedStartPageUrl.value = value;
};

const saveStartPageSettings = (notNow: boolean) => {
  if (notNow) {
    cookieService.removeCookie(cookieName.SelectedStartPageUrl);
    emit('close');
  }
  else if (selectedStartPageUrl.value) {
    if (cookieService.userConsentsToFunctionalCookies()) {
      cookieService.setCookie(cookieName.SelectedStartPageUrl, selectedStartPageUrl.value, { timeUnit: TimeUnit.Years, value: 1 });
      emit('close');
    }
  }
}

onMounted(() => {
  // Focus on the first input element when the component is mounted
  const firstInput = document.querySelector('.start-page-selector-list-input') as HTMLElement;
  if (firstInput) {
    firstInput.focus();
  }
});

</script>