import Vue from "vue";
import pedidoSIGAService from "@/services/pedidoSIGA";
import { normalizePedido } from "@utils";
import {
  PEDIDO_SIGA_FETCHED,
  SOCKET_PEDIDO_SIGA_CREATED,
  SOCKET_PEDIDO_SIGA_DELETED,
  SOCKET_PEDIDO_SIGA_UPDATED,
} from "../mutation-types";

const state = {
  Pedidos: {},
};

const mutations = {
  [PEDIDO_SIGA_FETCHED](state, data) {
    state.Pedidos = {};
    for (var p = 0; p < data.Pedidos.length; p++) {
      if (data.Pedidos[p].hasOwnProperty("Turma")) {
        var t = data.Pedidos[p].Turma;
        if (state.Pedidos[t] === undefined) {
          state.Pedidos[t] = [];
        }
        state.Pedidos[data.Pedidos[p].Turma].push(data.Pedidos[p]);
      }
    }
    state.Pedidos = Object.assign({}, state.Pedidos);
  },

  [SOCKET_PEDIDO_SIGA_CREATED](state, data) {
    if (state.Pedidos[data.Pedido.Turma] === undefined) state.Pedidos[data.Pedido.Turma] = [];
    state.Pedidos[data.Pedido.Turma].push(data.Pedido);
    state.Pedidos = Object.assign({}, state.Pedidos);
  },

  [SOCKET_PEDIDO_SIGA_UPDATED](state, data) {
    if (!state.Pedidos[data.Pedido.Turma]) return;

    const index = state.Pedidos[data.Pedido.Turma].findIndex(
      (pedido) => pedido.Curso === data.Pedido.Curso
    );
    if (index !== -1) Vue.set(state.Pedidos[data.Pedido.Turma], index, data.Pedido);
  },

  [SOCKET_PEDIDO_SIGA_DELETED](state, data) {
    if (!state.Pedidos[data.Pedido.Turma]) return;

    const index = state.Pedidos[data.Pedido.Turma].findIndex(
      (pedido) => pedido.Curso === data.Pedido.Curso
    );
    if (index !== -1) state.Pedidos[data.Pedido.Turma].splice(index, 1);
  },
};

const actions = {
  async fetchAll({ dispatch }) {
    return await dispatch("fetchAllPedidosSIGA");
  },
  fetchAllPedidosSIGA({ commit }) {
    return new Promise((resolve, reject) => {
      pedidoSIGAService
        .fetchAll()
        .then((response) => {
          commit(PEDIDO_SIGA_FETCHED, response);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  async createPedidoSIGA({ commit }, { data, notify }) {
    const pedidoNormalized = normalizePedido(data, ["vagasOferecidas", "vagasOcupadas"]);
    const response = await pedidoSIGAService.create(pedidoNormalized);

    if (notify) {
      commit("PUSH_NOTIFICATION", { type: "success", text: "O pedido foi criado" });
    }
    return response.Pedido;
  },
  async updatePedidoSIGA({ commit }, { data, notify }) {
    const pedidoNormalized = normalizePedido(data, ["vagasOferecidas", "vagasOcupadas"]);
    const response = await pedidoSIGAService.update(
      pedidoNormalized.Curso,
      pedidoNormalized.Turma,
      pedidoNormalized
    );

    if (notify) {
      commit("PUSH_NOTIFICATION", { type: "success", text: "O pedido foi atualizado" });
    }
    return response.Pedido;
  },
};

const getters = {
  AllPedidosSIGA(state) {
    return state.Pedidos;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
