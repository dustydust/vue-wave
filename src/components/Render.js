import * as THREE from "three";
export class Render {
    constructor() {
        this.scene = new THREE.Scene();
        this.paper = document.getElementById("render");
        this.camera = new THREE.OrthographicCamera( window.innerWidth / - 40,  window.innerWidth / 40, window.innerHeight / 40,  window.innerHeight / - 40, 0, 400);
        this.sphereHelper = new THREE.PolarGridHelper( 10, 16, 8, 64, 0x112211, 0x112233 );
        this.axishelp = new THREE.AxesHelper(5);

        // scene.add(axishelp);
        this.scene.add( this.sphereHelper );

        this.geometry = new THREE.CircleGeometry( 0.2, 12 );
        this.camera_look_point = new THREE.Mesh( this.geometry, false );
        this.camera.position.z = 55;

        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(this.paper.clientWidth, this.paper.clientHeight);
        this.paper.appendChild(this.renderer.domElement);

        this.max_particles_trail = 1200
        this.active_particles = []
        this.offset = new THREE.Vector3()
        this.distance = {x:25, y:25, z:25}
        this.p_pos = new THREE.Vector3()

        this.f_a = 0
        this.f_b = 0
        this.f_c = 0

        // User params
        this.camera_float = true
        this.diff_a = 0.206
        this.diff_b = 1.006
        this.diff_c = 1.003
        this.speed = 0.3
        this.amp = 9
    }

    spawnParticle(params) {
        const sphere = params["geometry"]
        const material = params["material"]
        return new THREE.Mesh(sphere, material)
    }

    setPeriods(periods) {
        this.diff_a = periods.alpha
        this.diff_b = periods.betta
        this.diff_c = periods.gamma
        this.speed = periods.speed
    }

    setCameraFloat() { this.camera_float = !this.camera_float }
    collapseModel() { this.amp = 3 }
    expandModel() { this.amp = 9 }

    setLongParticleTail() {
        this.clearParticles()
        this.max_particles_trail = 1200 
    }
    setShortParticleTail() {
        this.clearParticles()
        this.max_particles_trail = 300 
    }
    hideParticleTail() { this.max_particles_trail = 2 }

    clearParticles() {
        for (const particle of this.active_particles) {
            const object = this.scene.getObjectByProperty( 'uuid', particle.uuid )
            if (object) {
                object.geometry.dispose()
                object.material.dispose()
                this.scene.remove( object )
                this.renderer.renderLists.dispose()
            }
        }
        this.active_particles = []
    }

    animate(time) {
        this.f_a += this.diff_a * this.speed
        this.f_b += this.diff_b * this.speed
        this.f_c += this.diff_c * this.speed

        this.p_pos.x = Math.sin(this.f_a) * this.amp
        this.p_pos.y = Math.sin(this.f_b) * this.amp
        this.p_pos.z = Math.sin(this.f_c) * this.amp

        if ( this.active_particles.length < this.max_particles_trail ) {
            const particle = this.spawnParticle({
                "geometry": new THREE.SphereGeometry( 0.15 ),
                "material": new THREE.MeshBasicMaterial( { color:0x13ff4a,
                    transparent:false,
                    blending:THREE.AdditiveBlending
                })
            })
            this.active_particles.unshift( particle )

            particle.position.x = this.p_pos.x
            particle.position.y = this.p_pos.y
            particle.position.z = this.p_pos.z
            // particle.position.setFromSpherical(sphere_coords)
            
            this.scene.add( particle )

            for ( let i = 0; i < this.active_particles.length; i++ ) {
                if (i !== 0) {
                    let scale_opacity_value = (((this.active_particles.length - i) / this.max_particles_trail) * 100) / 60
                    this.active_particles[i].material.opacity = scale_opacity_value
                    this.active_particles[i].scale.set(
                        scale_opacity_value / 1.618,
                        scale_opacity_value / 1.618,
                        scale_opacity_value / 1.618
                    );
                }
            }
        } else {
            const last_particle = this.active_particles.pop()
            const object = this.scene.getObjectByProperty( 'uuid', last_particle.uuid )
            if (object) {
                object.geometry.dispose()
                object.material.dispose()
                this.scene.remove( object )
                this.renderer.renderLists.dispose()
            }
        }

        // SET CAMERA
        if (this.camera_float) {
            this.offset.x = this.distance.x * Math.sin( time * 0.00022 )
            this.offset.y = this.distance.y * Math.sin( time * 0.00002 )
            this.offset.z = this.distance.z * Math.cos( time * 0.00022 )
            this.camera.position.copy( {x:0, y:0, z:0} ).add( this.offset )
        }

        this.camera.lookAt( this.camera_look_point.position )

        requestAnimationFrame(this.animate.bind(this))
        this.renderer.render(this.scene, this.camera)
    }
    
}
