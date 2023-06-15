<template>
    <ul id="epi-quickNavigator">
        <li class="switch-preview">
            <label class="o-switch switch-preview__label">
                Förhandsgranska
                <input type="checkbox" class="o-switch__input" v-model="commonStore.preview" />
                <span class="o-switch__toggle u-float-right"> </span>
            </label>
        </li>
        <li class="epi-quickNavigator-editLink">
            <a :href="`${baseUrl}/EPiServer/CMS/?language=${pageContext.locale}#context=epi.cms.contentdata:///${pageContext.currentPage.Id}`"
                target="_self">
                <span>Episerver</span>
            </a>
        </li>
        <li class="epi-quickNavigator-dropdown">
            <button @click="showSubMenu = !showSubMenu" id="epi-quickNavigator-clickHandler"
                class="epi-quickNavigator-dropdown-arrow">
            </button>
            <ul v-if="showSubMenu" id="epi-quickNavigator-menu">
                <li>
                    <a :href="`${baseUrl}/episerver/`" target="_self">
                        Dashboard
                    </a>
                </li>
                <li>
                    <a :href="`${baseUrl}/EPiServer/CMS/?language=${pageContext.locale}#context=epi.cms.contentdata:///${pageContext.currentPage.Id}`"
                        target="_self">
                        CMS-redigering
                    </a>
                </li>
            </ul>
        </li>
    </ul>
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores/commonStore';
import { ref } from 'vue';
import { usePageContext } from '@/renderer/usePageContext'

const pageContext = usePageContext()
const commonStore = useCommonStore();
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const showSubMenu = ref(false);
</script>

<style lang="scss" scoped>
/**
This is copied from old solution, TODO: Refactor, but use for now in tekniklyftet?
*/
.switch-preview {
    border-right: 1px solid #e1410e;

    &__label {
        color: #fff;
        margin: 3px;
        width: 150px;
        font-weight: 600;
        margin-right: 10px;
    }
}

#epi-quickNavigator {
    background: #f7542b;
    border: 1px solid #f7542b;
    border-top: none;
    box-shadow: 0 0 10px 0 rgb(0 0 0 / 25%);
    display: inline-block;
    list-style: none;
    margin: 0;
    padding: 0;
    position: fixed;
    right: 10px;
    top: 0;
    z-index: 100000;

    >li {
        box-sizing: border-box;
        display: block;
        float: left;
        line-height: 16px !important;
        position: relative;
    }

    a {
        text-decoration: none;
    }

    .epi-quickNavigator-dropdown-arrow {
        background: #f7542b url('/static/admin/quicknav-arrow.png') center center no-repeat;
        border-left: 1px solid #e1410e;
        display: block;
        height: 26px;
        width: 19px;
    }

    .epi-quickNavigator-editLink a span {
        background: url('/static/admin/episerver-white.svg') center center no-repeat;
        display: block;
        height: 16px;
        line-height: 12px;
        margin: 6px 10px 0;
        text-indent: -9999em;
        width: 50px;
    }

    .epi-quickNavigator-dropdown ul {
        background: #555B61;
        border: 1px solid #666;
        list-style: none;
        padding: 6px 0;
        position: absolute;
        right: -1px;
        box-shadow: 0px 3px 8px rgb(0 0 0 / 20%);
        -moz-box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.2);
        -webkit-box-shadow: 0px 3px 8px rgb(0 0 0 / 20%);

        li a {
            color: #fff;
            display: block;
            font-family: Arial, Helvetica, Sans-Serif !important;
            font-size: 13px !important;
            line-height: 16px !important;
            white-space: nowrap;
            padding: 3px 20px;
        }
    }
}
</style>