import Component from "@ember/component";
import { inject as service } from "@ember/service";
import { task, timeout } from "ember-concurrency";
import { observer } from "@ember/object";
import { later } from "@ember/runloop";

export default Component.extend({
  bus: service(),
  compilador: service(),
  tagName: "",
  recursos: service(),
  debe_mantener_foco: false,
  cambiando: false,

  cuando_cambia_nombre: observer("nombre", function() {
    this.set("cambiando", true);
    later(this, this.reiniciar, 1);
  }),

  reiniciar() {
    this.set("cambiando", false);
  },

  didInsertElement() {
    this.recursos.iniciar();

    this.bus.on("ejemplo:finaliza_carga", this, "finaliza_carga");
    this.bus.on("ejemplo:cuando_termina_de_iniciar_ejecucion", this, "cuando_termina_de_iniciar_ejecucion");

    if (this.debe_mantener_foco) {
      this.tarea_para_mantener_foco.perform();
    }
  },

  tarea_para_mantener_foco: task(function*() {
    while (true) {
      this.hacer_foco_en_pilas();
      yield timeout(2000);
    }
  }),

  hacer_foco_en_pilas() {
    this.bus.trigger("ejemplo:hacer_foco_en_pilas", {});
  },

  didReceiveAttrs() {
    if (this.pilas) {
      this.compilar_proyecto_y_ejecutar();
    }
  },

  willDestroyElement() {
    this.bus.off("ejemplo:finaliza_carga", this, "finaliza_carga");
    this.bus.off("ejemplo:cuando_termina_de_iniciar_ejecucion", this, "cuando_termina_de_iniciar_ejecucion");
  },

  finaliza_carga() {
    this.compilar_proyecto_y_ejecutar();
  },

  compilar_proyecto_y_ejecutar() {
    let proyecto = this.proyecto;

    let resultado = this.compilador.compilar_proyecto(proyecto);

    let datos = {
      nombre_de_la_escena_inicial: proyecto.nombre_de_la_escena_inicial,
      codigo: resultado.codigo,
      proyecto: proyecto
    };

    this.bus.trigger("ejemplo:ejecutar_proyecto", datos);
  },

  cuando_termina_de_iniciar_ejecucion(pilas) {
    this.set("pilas", pilas);
    this.hacer_foco_en_pilas();
  }
});
