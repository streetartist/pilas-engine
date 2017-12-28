class EstadoEjecucion extends Phaser.State {
  entidades: any;
  sprites: any;

  init(datos) {
    this.entidades = datos.escena.actores;
    this.sprites = {};
  }

  create() {
    this.game.stage.backgroundColor = "F99";

    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.gravity.y = 200;
    this.game.physics.p2.restitution = 0.75;
    this.game.physics.p2.friction = 499;

    this.crear_actores_desde_entidades();
  }

  crear_actores_desde_entidades() {
    this.entidades.map(e => {
      this.crear_actor(e);
    });
  }

  crear_actor(entidad) {
    let x = entidad.x;
    let y = entidad.y;
    let imagen = entidad.imagen;
    let actor = null;

    if (entidad.tipo === "pelota") {
      actor = new Pelota(this.game, x, y, imagen);
      this.world.add(actor);
      actor.iniciar();
    } else {
      if (entidad.tipo === "caja") {
        actor = new Caja(this.game, x, y, imagen);
        this.world.add(actor);
        actor.iniciar();
      } else {
        actor = this.add.sprite(x, y, imagen);
      }
    }

    actor.pivot.x = entidad.centro_x;
    actor.pivot.y = entidad.centro_y;
  }

  update() {}
}