<template>
  <q-dialog ref="dialog" @hide="onHide" persistent>

    <q-card class="full-width" style="max-width: 600px" padding>

      <!-- HEADER -->
      <q-card-section class="row items-center">
        <div class="text-h6">Накладення ЕЦП</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <!-- BODY -->
      <q-card-section>

        <q-tabs v-model="tab" inline-label>
          <q-tab name="file" label="Файловий ключ" />
          <q-tab name="media" label="Апаратний ключ" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>

          <!--- FILE SIGNER TAB--->
          <q-tab-panel name="file">

            <!-- ERROR BUNNER -->
            <q-banner v-if="$store.state.eds.file.error" dense class="bg-red-1 text-black" style="min-height: 120px;">
              <template v-slot:avatar>
                <q-icon name="warning" color="red-4" size="sm" />
              </template>
              Помилка ініціалізації бібліотеки для роботи з файловими ключами.
              <span v-html="$store.state.eds.file.error" />
              <template v-slot:action>
                <q-btn dense flat label="Повторити" class="text-red" @click="initEuSignFile" />
              </template>
            </q-banner>

            <!-- SIGN FORM -->
            <q-form v-else @submit="readKeyFile" @reset="clearKeyFile" autocomplete="off">
              <q-file
                v-model="file.key"
                label="Особистий ключ (Key-6.dat, *.pfx, *.pk8, *.zs2 або *.jks)"
                stack-label
                filled
                dense
                clearable
                bottom-slots
                accept=".dat,.pfx,.pk8,.zs2,.jks"
                max-file-size="102400"
                :disable="file.isPrivateKeyReaded || media.isPrivateKeyReaded || file.progressRead"
                class="col-12"
                error-message="Виберіть файл особистого ключа"
                :error="$v.file.key.$error"
                />
              </q-file>
              <div class="row">
                <db-input
                  v-model="file.password"
                  type="password"
                  label="Пароль захисту ключа"
                  filled
                  dense
                  class="col-xs-12 col-sm-8"
                  :class="{'q-pr-sm': !$q.screen.lt.sm}"
                  :upper-case="false"
                  :disable="file.isPrivateKeyReaded || media.isPrivateKeyReaded || file.progressRead"
                  :validate="$v.file.password"
                  />

                <!-- SUBMIT BUTTON -->
                <q-btn
                  type="submit"
                  v-if="!file.isPrivateKeyReaded"
                  :loading="file.progressRead"
                  label="Зчитати"
                  dense
                  outline
                  color="primary"
                  class="col-xs-12 col-sm-4"
                  style="height: 40px;"
                  :disable="media.isPrivateKeyReaded || file.progressRead"
                  >
                  <template v-slot:loading>
                    <q-spinner-dots class="on-left" />
                  </template>
                </q-btn>

                <!-- RESET BUTTON -->
                <q-btn v-else label="Зтерти" dense outline color="primary" class="col-xs-12 col-sm-4" style="height: 40px;" type="reset" />
              </div>

            </q-form>

            <q-inner-loading :showing="$store.state.eds.file.progressInit || media.progressRead">
              <q-spinner-ios size="md" color="primary" />
            </q-inner-loading>

          </q-tab-panel>

          <!--- MEDIA SIGNER TAB--->
          <q-tab-panel name="media">

            <!-- ERROR BUNNER -->
            <q-banner v-if="$store.state.eds.media.error" dense class="bg-red-1 text-black" style="min-height: 120px;">
              <template v-slot:avatar>
                <q-icon name="warning" color="red-4" size="sm" />
              </template>
              Помилка ініціалізації бібліотеки для роботи з аппаратними носіями.
              <span v-html="$store.state.eds.media.error" />
              <template v-slot:action>
                <q-btn dense flat label="Повторити" class="text-red" @click="initEuSignMedia" />
              </template>
            </q-banner>

            <!-- SIGN FORM -->
            <q-form v-else @submit="readKeyMedia" @reset="clearKeyMedia" autocomplete="off">
              <db-input
                v-model="media.key"
                type="select"
                label="Носій особистого ключа"
                :dict="$store.state.eds.media.medias"
                clearable
                class="col-12"
                :disable="file.isPrivateKeyReaded || media.isPrivateKeyReaded || media.progressRead"
                :validate="$v.media.key"
                />
              <div class="row">
                <db-input
                  v-model="media.password"
                  type="password"
                  label="Пароль захисту ключа"
                  filled
                  dense
                  class="col-xs-12 col-sm-8"
                  :class="{'q-pr-sm': !$q.screen.lt.sm}"
                  :upper-case="false"
                  :disable="file.isPrivateKeyReaded || media.isPrivateKeyReaded  || media.progressRead"
                  @keyup.enter.native="readKeyMedia"
                  :validate="$v.media.password"
                  />

                <!-- SUBMIT BUTTON -->
                <q-btn
                  type="submit"
                  v-if="!media.isPrivateKeyReaded"
                  :loading="media.progressRead"
                  label="Зчитати"
                  dense
                  outline
                  color="primary"
                  class="col-xs-12 col-sm-4"
                  style="height: 40px;"
                  :disable="file.isPrivateKeyReaded || media.progressRead"
                  >
                  <template v-slot:loading>
                    <q-spinner-dots class="on-left" />
                  </template>
                </q-btn>

                <!-- RESET BUTTON -->
                <q-btn v-else label="Зтерти" dense outline color="primary" class="col-xs-12 col-sm-4" style="height: 40px;" type="reset" />
              </div>
            </q-form>

            <q-inner-loading :showing="$store.state.eds.media.progressInit || file.progressRead">
              <q-spinner-ios size="md" color="primary" />
            </q-inner-loading>

          </q-tab-panel>

        </q-tab-panels>

        <!-- SIGN BUNNER -->
        <q-banner v-if="file.isPrivateKeyReaded || media.isPrivateKeyReaded" class="bg-green-1 text-black q-mx-md" style="min-height: 100px;" dense>
          <template v-slot:avatar>
            <q-icon name="verified_user" color="green-4" size="sm" />
          </template>
          <div class="row">Власник: <span class="text-bold q-pl-xs ellipsis">{{ subjCN }}</span></div>
          <div class="row">ЦСК: <span class="text-bold q-pl-xs ellipsis">{{ issuerCN }}</span></div>
          <div class="row">Серійний номер: <span class="text-bold q-pl-xs ellipsis">{{ serial }}</span></div>
          <div class="row">Організація: <span class="text-bold q-pl-xs ellipsis">{{ subjOrg }}</span></div>
        </q-banner>

        <!-- DEFAULT BANNER -->
        <q-banner v-else class="bg-blue-1 text-black q-mx-md" style="min-height: 100px;" dense>
          <template v-slot:avatar>
            <q-icon name="info" color="blue-5" size="sm" />
          </template>
          Електронний підпис має вигляд окремого файлу або зберігається на захищеному носії. Також, він може бути записаний на ID-картку.
          Система автоматично визначає Акредитований центр сертифікації ключів, яким був виданий сертифікат підпису.
        </q-banner>

      </q-card-section>

      <!-- FOOTER -->
      <q-card-actions align="right">
        <q-btn color="primary" flat label="Скасувати" v-close-popup :disable="file.progressRead" />
        <q-btn color="primary" label="Підписати" :disable="(!file.isPrivateKeyReaded && !media.isPrivateKeyReaded) || file.progressRead" @click="signData" />
      </q-card-actions>
      <q-inner-loading :showing="progressSign">
        <q-spinner-ios size="md" color="primary" />
      </q-inner-loading>
    </q-card>
  </q-dialog>
</template>

<script>

  import { initEuSignFile } from 'db-eds/lib/eu-sign-file';
  import { initEuSignMedia } from 'db-eds/lib/eu-sign-media';
  import { EndUserKeyMedia } from 'db-eds/lib/euscp';

  import { required } from 'vuelidate/lib/validators';

  export default {
    name: 'SignForm',
    props: {
      doc: {
        type: [String, Function],
        default: ''
      }
    },
    computed: {
      tab: {
        get() {
          return this.$store.state.eds.tab;
        },
        set(val) {
          this.$store.commit('eds/setTab', val);
        }
      }
    },
    watch: {
      'file.key': function (val) {
        this.$store.commit('eds/file/setKey', val);
      },
      'media.key': function (val) {
        this.$store.commit('eds/media/setKey', val);
      },
    },
    data() {
      return {

        // forms
        file: {
          key: this.$store.state.eds.file.key,
          password: null,
          isPrivateKeyReaded: false,
          progressRead: false
        },
        media: {
          key: this.$store.state.eds.media.key,
          password: null,
          isPrivateKeyReaded: false,
          progressRead: false
        },

        // info
        issuerCN: null,
        subjCN: null,
        subjOrg: null,
        serial: null,
        progressSign: false
      }
    },
    static() {
      return {
        initEuSignFile,
        initEuSignMedia
      }
    },
    methods: {
      show() {
        this.$refs.dialog.show();
      },
      hide() {
        this.$refs.dialog.hide();
      },
      onHide() {
        this.$euSignFile.ResetPrivateKey();
        this.$euSignMedia.ResetPrivateKey();
        this.$emit('hide');
      },
      readFileAsync(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (evt) => {
            resolve({'file': file, 'data': new Uint8Array(evt.target.result)});
          };
          reader.onerror = (err) => reject(err);
          reader.readAsArrayBuffer(file);
        });
      },
      async clearKeyFile() {
        await this.$euSignFile.ResetPrivateKey();
        this.file.key = null;
        this.file.password = null;
        this.file.isPrivateKeyReaded = false;
      },
      async clearKeyMedia() {
        await this.$euSignMedia.ResetPrivateKey();
        this.media.key = null;
        this.media.password = null;
        this.media.isPrivateKeyReaded = false;
      },
      setSignInfo(result) {
        this.issuerCN = result.issuerCN;
        this.subjCN = result.subjCN;
        this.subjOrg = result.subjOrg;
        this.serial = result.serial;
      },
      async readKeyFile() {
        try {
          this.file.progressRead = true;

          // validations
          this.$v.file.$touch();
          if (this.$v.file.$error) {
            return;
          }
          this.$v.file.$reset();

          let {data, file} = await this.readFileAsync(this.file.key);
          if (file.name.endsWith('.jks')) {
            const jksKeys = await this.$euSignFile.GetJKSPrivateKeys(data);
            data = jksKeys[0].privateKey;
          }

          const result = await this.$euSignFile.ReadPrivateKeyBinary(data, this.file.password);
          this.setSignInfo(result);
          this.file.isPrivateKeyReaded = true;
        } catch (err) {
          console.error(err);
          this.file.isPrivateKeyReaded = false;
          this.$q.notify({color: 'negative', timeout: 2500, message: err.message, position: 'top', icon: 'error'});
        } finally {
          this.file.progressRead = false;
        }
      },
      async readKeyMedia() {
        try {
          this.media.progressRead = true;

          // validations
          this.$v.media.$touch();
          if (this.$v.media.$error) {
            return;
          }
          this.$v.media.$reset();

          const keyMedia = new EndUserKeyMedia(this.media.key);
          keyMedia.password = this.media.password;

          const result = await this.$euSignMedia.ReadPrivateKey(keyMedia);
          this.setSignInfo(result);
          this.media.isPrivateKeyReaded = true;
        } catch (err) {
          console.error(err);
          this.media.isPrivateKeyReaded = false;
          this.$q.notify({color: 'negative', timeout: 2500, message: err.message, position: 'top', icon: 'error'});
        } finally {
          this.media.progressRead = false;
        }
      },
      async signData() {

        try {

          this.progressSign = true;

          const fileReaded = this.file.isPrivateKeyReaded && await this.$euSignFile.IsPrivateKeyReaded();
          const mediaReaded = this.media.isPrivateKeyReaded && await this.$euSignMedia.IsPrivateKeyReaded();

          let euSign;

          if (fileReaded) {
            euSign = this.$euSignFile;
          } else if (mediaReaded) {
            euSign = this.$euSignMedia;
          } else {
            await this.clearKeyFile()
            await this.clearKeyMedia();
            throw Error('Ключ не було зчитано!');
          }

          let doc = this.doc;

          if (typeof doc === 'function') {
            const arrayBuffer = await doc();
            doc = new Uint8Array(arrayBuffer);
          }

          const signedData = await euSign.SignDataInternal(true, doc, false);

          this.$q.notify({color: 'positive', timeout: 2500, message: 'Документ успішно підписано', position: 'top', icon: 'done'});
          this.$emit('ok', signedData);
          this.hide();

        } catch (err) {
          console.error(err);
          this.$q.notify({color: 'negative', timeout: 2500, message: err.message, position: 'top', icon: 'error'});
        } finally {
          this.progressSign = false;
        }

      }
    },
    validations: {
      file: {
        key: {required},
        password: {required}
      },
      media: {
        key: {required},
        password: {required}
      }
    }
  }
</script>
