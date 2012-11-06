/**
 * @author orbitingeden / http://orbitingeden.com.com/
 */

/* 
 * orbited = the mesh that is orbiting (i.e. International Space Station)
 * orbited = the mesh that is being orbited (i.e. Earth)
 * orbitedMass = the mass of the object being orbited in kg (i.e. for Earth the value is 5973600000000000000000000)
 * 
 * This function should be called one time per orbiting object. 
 * i.e. once for each satellite and spaceship, 
 * once for the moon and even the earth, 
 * other planets and the sun, etc.
 * 
 * For Earth-centric orbits, 1 unit of position = 1km
 * 1 unit of momentum = 1km
 */

THREE.Orbit = function () { 

	this.useArcLength = false;
	this.lapse = 1;

};

THREE.Orbit.prototype = {
		
		coordinate: function( orbiteds, orbiter ){
			
			//accepts meshes in array form or individually
			if( Object.prototype.toString.call( orbiteds ) != '[object Array]' ) {
				orbiteds = [orbiteds];
			}

			this.tracking =[];
			var gravityWells = [];
			var biggestWell = 0;
			var orbited;
			//cycle through gravity wells
			for(i=0; i<orbiteds.length; i++){
				
				//apply this gravity well's gravity component to the object's momentum
				gravityWells[i] 		= new THREE.Gravity( orbiteds[i], orbiter );
				gravityWells[i].orbited = orbiteds[i];
				gravityWells[i].orbiter = orbiter;
				gravityWells[i].getForce();
				this.updateMomentum(orbiter, gravityWells[i].force);

				//log statistics for use externally
				var statistics = {};
				statistics.label = orbiteds[i].name;
				statistics.Gh = gravityWells[i].Gh;
				statistics.orbitalRadius = gravityWells[i].orbitalRadius;
				this.tracking.push(statistics);
				
				//determine which well is being orbited
				if((i < 1) || (gravityWells[i].force.length() > biggestWell[0].force.length())){
					biggestWell = [gravityWells[i], i];
				}
				orbited = orbiteds[biggestWell[1]];
			}
			
			//after all of the gravity perturbations have been applied, update mesh position
			this.ratio = this.updatePosition( orbiter, orbited );

		},
		
		updatePosition: function(orbiter, orbited){

			if(orbiter['momentum']){
				var movement = orbiter['momentum'].clone();
			} 

			//if you are having performance issues you can disable useArcLength 
			if(this.useArcLength){
				this.getArcLength(orbited, orbiter);
				this.ratio 		= this.arcLength / movement.length();
			} else {
				this.ratio = 1;
			}
			
			// 1000 represents meters to kilometers
			orbiter['position'].x += movement.x * this.lapse; 
			orbiter['position'].y += movement.y * this.lapse;
			orbiter['position'].z += movement.z * this.lapse;
			
		},

		updateMomentum: function(orbiter, gravityPull){
			
			orbiter['momentum'].x	+= gravityPull.x / 1000 * this.lapse;
			orbiter['momentum'].y	+= gravityPull.y / 1000 * this.lapse;
			orbiter['momentum'].z	+= gravityPull.z / 1000 * this.lapse;
						
		},
		
		getArcLength: function(orbited, orbiter) {
		
			var radius 		= orbited['position'].length() - orbiter['position'].length();
			var moment		= orbiter['momentum'].length() / 2; //2 is to create a right triangle 
			
			this.angle		= Math.asin(moment/radius);//*180/Math.PI;
			
			//x = 2 * PI * r * (.5 * chord / r / 360); 
			this.arcLength	= this.angle * radius * 2; //2 is to return to isociles triangle
			
		}
}

if(!THREE.Mesh.momentum){
	THREE.Mesh.prototype.momentum = new THREE.Vector3();
}
