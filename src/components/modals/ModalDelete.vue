<template>
  <BaseModal
    ref="baseModalDelete"
    title="Confirmar exclusão"
    position="center"
    :hasOverlay="true"
    :hasFooter="isDeleting"
    :styles="{ width: '400px', maxHeight: '600px', fontSize: '14px' }"
  >
    <template #modal-body>
      <ul class="list-group list-delete">
        <slot></slot>
      </ul>
    </template>

    <template #modal-footer>
      <div class="mr-auto">
        <BaseButton
          v-if="hasClearDelete"
          text="Cancelar seleções"
          color="gray"
          class="px-3"
          @click="emitClearDelete"
        />
      </div>
      <BaseButton text="Excluír" color="red" class="px-3" @click="emitDelete" />
    </template>
  </BaseModal>
</template>

<script>
export default {
  name: "ModalDelete",
  props: {
    isDeleting: { type: Boolean, default: false },
    hasClearDelete: { type: Boolean, default: false },
  },
  methods: {
    open() {
      this.$refs.baseModalDelete.open();
    },
    close() {
      this.$refs.baseModalDelete.close();
    },
    emitDelete() {
      this.close();
      this.$emit("btn-deletar");
    },
    emitClearDelete() {
      this.close();
      this.$emit("btn-clear");
    },
  },
};
</script>

<style lang="scss">
.modal-custom .list-delete > .list-group-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  word-wrap: break-word;
  padding: 5px 15px;
}
</style>
