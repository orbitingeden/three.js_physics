/**
 * @author orbitingeden / http://orbitingeden.com.com/
 */

/* 
 * orbited = the mesh that is being orbited (i.e. Earth)
 * orbiter = the mesh that is orbiting (i.e. International Space Station)
 * 				orbiter may be any other body, like a person walking on the ground or a plane flying in the sky.
 * orbitedMass = the mass of the object being orbited in kg (i.e. for Earth the value is 5973600000000000000000000)
 * 
 * sample distance (in km) between orbited(earth) and orbiter(iss) = 6748
 * 
 * smaller useful ratio: 
 * 
 * This function may be called one time per gravity well. 
 * i.e. once for the earth, once for the moon, once for the sun and even once for Juptier.
 * 
 * For Earth-centric orbits, 1 unit of position = 1km
 */

THREE.Gravity = function () { 
	
	this.G 				= .0000000000667384;		//gravity Constant 

	//set bodies
	this.orbited;
	this.orbiter;
	
};

THREE.Gravity.prototype = {
		
		getForce: function(){

			
			//determine distance between the gravity body and the orbiter
			var distance	= new THREE.Vector3();
			if( this.orbited.position && 
					this.orbiter.position ){
				distance.sub(this.orbited['position'], this.orbiter['position']);
			}
			this.orbitalRadius 	= distance.length();	
			
			// Gh = GM / r^2               * 1000 converts km to m
			this.Gh 			= this.G * this.orbited.mass / Math.pow( this.orbitalRadius * 1000, 2 );

			//establish a vectorized momentum for this unit of time
			this.force 		= new THREE.Vector3();
			this.force.x	= ( distance.x / this.orbitalRadius ) * this.Gh;
			this.force.y	= ( distance.y / this.orbitalRadius ) * this.Gh;
			this.force.z	= ( distance.z / this.orbitalRadius ) * this.Gh;
			
		}

}

if(!THREE.Mesh.mass){
	THREE.Mesh.prototype.mass = 0;	
}