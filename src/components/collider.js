(function(m) {

	m.Collider = class Collider extends m.Component {
		constructor({x = 0, y = 0, w = 1, h = 1, angle = 0} = {}) {
			super();
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
			this.angle = angle;
		}
		enable(entity) {
			this.bodyAdder = () => {
				const sim = entity.game.components.get(rigid.component.Simulation);
				if (sim != null) {
					sim.system.insert(this.body);
				}
			}
			this.bodyRemover = () => {
				const sim = entity.game.components.get(rigid.component.Simulation);
				if (sim != null) {
					sim.system.remove(this.body);
				}
			}
			this.bodyUpdater = () => {
				if (!entity.components.has(rigid.component.Transform)) return;
				this.body.x = entity.x + this.x;
				this.body.y = entity.y + this.y;
				this.body.scale_x = entity.w * this.w;
				this.body.scale_y = entity.h * this.h;
				this.body.scale = entity.w * this.w;
				this.body.angle = rigid.math.radians(entity.angle + this.angle);
			}
			entity.events.register("add", this.bodyAdder);
			entity.events.register("remove", this.bodyRemover);
			entity.events.register("postupdate", this.bodyUpdater);
			if (entity.exists) {
				this.bodyAdder();
			}
			this.bodyUpdater();
			entity.collision = other => {
				const collider = other.components.get(rigid.component.Collider);
				if (collider == null) return false;
				return this.body.collides(collider.body);
			}
		}
		disable(entity) {
			if (entity.exists) {
				this.bodyRemover();
			}
			entity.events.unregister("add", this.bodyAdder);
			entity.events.unregister("remove", this.bodyRemover);
			entity.events.unregister("postupdate", this.bodyUpdater);
		}
	}

})(rigid.component);
rigid.component.collide = {};