<template>
  <div class="main-component row">
    <portal to="page-header">
      <BaseButton template="ajuda" @click="$refs.modalAjuda.toggle()" />
    </portal>

    <div class="page-content">
      <div class="div-table">
        <BaseTable>
          <template #thead>
            <v-th-ordination
              :currentOrder="ordenacaoMain.disciplina"
              orderToCheck="codigo"
              width="85"
              align="start"
            >
              Código
            </v-th-ordination>

            <v-th-ordination
              :currentOrder="ordenacaoMain.disciplina"
              orderToCheck="nome"
              width="300"
              align="start"
            >
              Nome
            </v-th-ordination>

            <v-th-ordination
              :orderFixed="true"
              :currentOrder="ordenacaoMain.perfil"
              orderToCheck="perfil.abreviacao"
              width="80"
              align="start"
            >
              Perfil
            </v-th-ordination>

            <v-th width="40" title="Carga Teórica">C.T.</v-th>
            <v-th width="40" title="Carga Prática">C.P.</v-th>

            <v-th-ordination
              :currentOrder="ordenacaoMain.disciplina"
              orderToCheck="ead"
              orderType="desc"
              width="70"
            >
              EAD
            </v-th-ordination>

            <v-th-ordination
              :currentOrder="ordenacaoMain.disciplina"
              orderToCheck="laboratorio"
              orderType="desc"
              width="70"
              title="Laborátorio"
            >
              Lab.
            </v-th-ordination>

            <v-th-ordination
              :currentOrder="ordenacaoMain.disciplina"
              orderToCheck="departamento"
              width="70"
              title="Departamento"
              align="start"
            >
              Depto.
            </v-th-ordination>
          </template>
          <template #tbody>
            <tr
              v-for="disciplina in DisciplinasOrdered"
              :key="disciplina.id + disciplina.nome"
              @click="handleClickInDisciplina(disciplina)"
              :class="['clickable', disciplinaEstaSelecionada(disciplina.id)]"
            >
              <v-td width="85" align="start">
                {{ disciplina.codigo }}
              </v-td>
              <v-td width="300" align="start">
                {{ disciplina.nome }}
              </v-td>
              <v-td
                width="80"
                align="start"
                :style="{ backgroundColor: disciplina.perfil.cor, color: '#212529' }"
              >
                {{ disciplina.perfil.abreviacao }}
              </v-td>
              <v-td width="40">
                {{ disciplina.cargaTeorica }}
              </v-td>
              <v-td width="40">
                {{ disciplina.cargaPratica }}
              </v-td>
              <v-td width="70">
                {{ textoEad(disciplina.ead) }}
              </v-td>
              <v-td width="70">
                {{ textoLab(disciplina.laboratorio) }}
              </v-td>
              <v-td width="70" align="start">
                {{ textoDepto(disciplina.departamento) }}
              </v-td>
            </tr>
            <tr v-if="!DisciplinasOrdered.length">
              <v-td width="755" colspan="8">
                <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="icon-red" />
                <b>Nenhuma disciplina encontrada!</b>
              </v-td>
            </tr>
          </template>
        </BaseTable>
      </div>

      <Card
        :title="'Disciplina'"
        width="380"
        :toggleFooter="isEditing"
        @btn-salvar="handleEditDisciplina"
        @btn-delete="openModalDelete"
        @btn-add="handleCreateDisciplina"
        @btn-clean="cleanForm"
      >
        <template #body>
          <VInput label="Nome" v-model="disciplinaForm.nome" :validation="$v.disciplinaForm.nome" />

          <div class="row">
            <div class="col">
              <VInput
                label="Código"
                v-model="disciplinaForm.codigo"
                :validation="$v.disciplinaForm.codigo"
              />
            </div>
            <div class="col">
              <VSelect
                label="Turno"
                v-model="disciplinaForm.Perfil"
                :validation="$v.disciplinaForm.Perfil"
              >
                <b-form-select-option v-if="!AllPerfis.length" value="">
                  Nenhum Perfil Encontrado
                </b-form-select-option>
                <b-form-select-option
                  v-for="perfil in AllPerfis"
                  :key="perfil.id + perfil.nome"
                  :value="perfil.id"
                >
                  {{ perfil.abreviacao }}
                </b-form-select-option>
              </VSelect>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <VInput
                inputType="number"
                label="Carga Teórica"
                v-model.number="disciplinaForm.cargaTeorica"
                :validation="$v.disciplinaForm.cargaTeorica"
              />
            </div>
            <div class="col">
              <VInput
                inputType="number"
                label="Carga Prática"
                v-model.number="disciplinaForm.cargaPratica"
                :validation="$v.disciplinaForm.cargaPratica"
              />
            </div>
          </div>

          <div class="row">
            <div class="col">
              <VSelect
                label="Laboratório"
                v-model.number="disciplinaForm.laboratorio"
                :validation="$v.disciplinaForm.laboratorio"
              >
                <b-form-select-option value="0">Não</b-form-select-option>
                <b-form-select-option value="1">Sim</b-form-select-option>
                <b-form-select-option value="2">Desejável</b-form-select-option>
              </VSelect>
            </div>
            <div class="col">
              <VSelect
                label="EAD"
                v-model.number="disciplinaForm.ead"
                :validation="$v.disciplinaForm.ead"
              >
                <b-form-select-option value="0">Não</b-form-select-option>
                <b-form-select-option value="1">Integral</b-form-select-option>
                <b-form-select-option value="2">Parcial</b-form-select-option>
              </VSelect>
            </div>
          </div>

          <div class="row">
            <div class="col-6">
              <VSelect
                label="Departamento"
                v-model.number="disciplinaForm.departamento"
                :validation="$v.disciplinaForm.departamento"
              >
                <b-form-select-option value="1">{{ textoDepto(1) }}</b-form-select-option>
                <b-form-select-option value="2">{{ textoDepto(2) }}</b-form-select-option>
              </VSelect>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <ModalDelete ref="modalDelete" :isDeleting="isEditing" @btn-deletar="handleDeleteDisciplina">
      <li v-if="isEditing" class="list-group-item">
        <span>
          Tem certeza que deseja excluír a disciplina
          <b>{{ disciplinaForm.codigo }} - {{ disciplinaForm.nome }}</b>
          ?
        </span>
      </li>
      <li v-else class="list-group-item">Nenhuma disciplina selecionada.</li>
    </ModalDelete>

    <ModalAjuda ref="modalAjuda">
      <li class="list-group-item">
        <b>Adicionar:</b>
        Preencha o cartão em branco à direita e em seguida, clique em Adicionar
        <font-awesome-icon :icon="['fas', 'plus']" class="icon-green" />
        .
      </li>
      <li class="list-group-item">
        <b>Editar:</b>
        Clique na linha da tabela da disciplina que deseja alterar. Em seguida, no cartão à direita,
        altere as informações que desejar e clique em Salvar
        <font-awesome-icon :icon="['fas', 'check']" class="icon-green" />
        .
      </li>
      <li class="list-group-item">
        <b>Deletar:</b>
        Clique na linha da tabela da disciplina que deseja remover. Em seguida, no cartão à direita,
        clique em Remover
        <font-awesome-icon :icon="['fas', 'trash-alt']" class="icon-red" />
        e confirme a remoção na janela que será aberta.
      </li>
      <li class="list-group-item">
        <b>Limpar:</b>
        No cartão à direita, clique em Cancelar
        <font-awesome-icon :icon="['fas', 'times']" class="icon-gray" />
        , para limpar as informações.
      </li>
      <li class="list-group-item">
        <b>Ordenar:</b>
        Clique no cabeçalho da tabela, na coluna desejada, para alterar a ordenação das informações.
      </li>
    </ModalAjuda>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { orderBy } from "lodash-es";
import { required, integer } from "vuelidate/lib/validators";
import { makeEmptyDisciplina } from "@utils/factories";
import { ModalDelete, ModalAjuda } from "@/components/modals";
import { Card, VInput, VSelect } from "@/components/ui";

export default {
  name: "DashboardDisciplina",
  components: { Card, VInput, VSelect, ModalDelete, ModalAjuda },
  data() {
    return {
      disciplinaSelecionada: "",
      disciplinaForm: makeEmptyDisciplina(),
      ordenacaoMain: {
        disciplina: { order: "codigo", type: "asc" },
        perfil: { order: "perfil.abreviacao", type: "asc" },
      },
    };
  },
  validations: {
    disciplinaForm: {
      nome: { required },
      codigo: { required },
      Perfil: { required },
      cargaTeorica: { required, integer },
      cargaPratica: { required, integer },
      laboratorio: { required },
      ead: { required },
      departamento: { required },
    },
  },

  methods: {
    ...mapActions(["createDisciplina", "editDisciplina", "deleteDisciplina"]),

    handleClickInDisciplina(disciplina) {
      this.disciplinaSelecionada = disciplina.id;
      this.disciplinaForm = { ...disciplina };
    },
    cleanForm() {
      this.disciplinaSelecionada = "";
      this.disciplinaForm = makeEmptyDisciplina();
      this.$nextTick(() => this.$v.$reset());
    },
    disciplinaEstaSelecionada(disciplinaId) {
      return this.disciplinaSelecionada === disciplinaId ? "bg-selected" : "";
    },
    openModalDelete() {
      this.$refs.modalDelete.open();
    },
    textoLab(lab) {
      if (lab == 0) return "-";
      if (lab == 1) return "Sim";
      if (lab == 2) return "Desejável";
    },
    textoEad(ead) {
      if (ead == 0) return "-";
      if (ead == 1) return "Integral";
      if (ead == 2) return "Parcial";
    },
    textoDepto(dpto) {
      if (dpto === 1) return "DCC";
      if (dpto === 2) return "Outro";
    },

    async handleCreateDisciplina() {
      this.$v.disciplinaForm.$touch();
      if (this.$v.disciplinaForm.$anyError) return;

      try {
        this.setLoading({ type: "partial", value: true });
        await this.createDisciplina({ ...this.disciplinaForm });
        this.cleanForm();
      } catch (error) {
        this.pushNotification({
          type: "error",
          title: "Erro ao criar nova disciplina!",
          text: error.message || "",
        });
      } finally {
        this.setLoading({ type: "partial", value: false });
      }
    },
    async handleEditDisciplina() {
      this.$v.disciplinaForm.$touch();
      if (this.$v.disciplinaForm.$anyError) return;

      try {
        this.setLoading({ type: "partial", value: true });
        await this.editDisciplina({ ...this.disciplinaForm });
      } catch (error) {
        this.pushNotification({
          type: "error",
          title: "Erro ao atualiza disciplina!",
          text: error.message || "",
        });
      } finally {
        this.setLoading({ type: "partial", value: false });
      }
    },
    async handleDeleteDisciplina() {
      this.$v.disciplinaForm.$touch();
      if (this.$v.disciplinaForm.$anyError) return;

      try {
        this.setLoading({ type: "partial", value: true });
        await this.deleteDisciplina({ ...this.disciplinaForm });
        this.cleanForm();
      } catch (error) {
        this.pushNotification({
          type: "error",
          title: "Erro ao deletar disciplina!",
          text: error.message || "",
        });
      } finally {
        this.setLoading({ type: "partial", value: false });
      }
    },
  },

  computed: {
    ...mapGetters(["AllDisciplinas", "AllPerfis"]),

    DisciplinasOrdered() {
      const disciplinasResultantes = orderBy(
        this.AllDisciplinas,
        this.ordenacaoMain.disciplina.order,
        this.ordenacaoMain.disciplina.type
      );

      if (this.ordenacaoMain.perfil.order !== null) {
        return orderBy(
          disciplinasResultantes,
          this.ordenacaoMain.perfil.order,
          this.ordenacaoMain.perfil.type
        );
      }
      return disciplinasResultantes;
    },
    isEditing() {
      return this.disciplinaForm.id !== null;
    },
  },
};
</script>