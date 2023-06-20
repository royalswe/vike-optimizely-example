<template>
    <h2>This is the layout and +Page will be rendered inside the slot</h2>
    <h3>If no +Layout is defined, then the renderer/LayoutDefault.vue will be layout as default</h3>
    <suspense>
        <slot />
    </suspense>
</template>