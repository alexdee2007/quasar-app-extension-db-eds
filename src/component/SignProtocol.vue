<template>
  <q-dialog ref="dialog" @hide="onHide">

    <q-card class="full-width" style="max-width: 600px" padding>

      <q-card-section class="row items-center">
        <div class="text-h6">Протокол первірки ЕЦП</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section v-if="signerInfos.length">
        <q-banner class="bg-green-1 text-black q-pa-md" dense>

          <template v-slot:avatar>
            <q-icon name="verified_user" color="green-4" size="sm" />
          </template>

          <div class="row"><span class="text-bold text-green-7">Підпис успішно перевірено, цілісність даних підтверджено.</span></div>

          <template v-for="(sign, key) in signerInfos">

            <div class="row q-pt-md">Підписувач: <span class="text-bold q-pl-xs">{{ sign.ownerInfo.subjCN }}</span></div>
            <div class="row">П.І.Б.: <span class="text-bold q-pl-xs">{{ sign.ownerInfo.subjFullName }}</span></div>
            <div class="row">РНОКПП: <span class="text-bold q-pl-xs">{{ sign.ownerInfo.subjDRFOCode }}</span></div>
            <div class="row">Організація: <span class="text-bold q-pl-xs">{{ sign.ownerInfo.subjOrg }}</span></div>
            <div class="row">Сертифікат виданий: <span class="text-bold q-pl-xs">{{ sign.ownerInfo.issuerCN }}</span></div>
            <div class="row">Серійний номер: <span class="text-bold q-pl-xs ellipsis">{{ sign.ownerInfo.serial }}</span></div>
            <div class="row">Час підпису: <span class="text-bold q-pl-xs">{{ sign.timeInfo.time | formatDatetime }}</span></div>

          </template>

        </q-banner>

      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script>


  export default {
    name: 'SignProtocol',
    props: {
      signerInfos: {
        type: Array,
        required: true
      },
    },
    methods: {
      show() {
        this.$refs.dialog.show();
      },
      hide() {
        this.$refs.dialog.hide();
      },
      onHide() {
        this.$emit('hide');
      }
    }
  }
</script>
