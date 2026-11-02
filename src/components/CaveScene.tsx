"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
const palettes=["#d9b879","#8dd7df","#c6a0f3","#65e2d1","#f0a46f","#e8c17b","#83b9f4","#aaa5ff","#6ed6d5","#e8c77d"];
function Crystal({position,scale=1,color="#74e6e5",rotation=0}:{position:[number,number,number];scale?:number;color?:string;rotation?:number}){
 return <group position={position} rotation={[0,rotation,0]} scale={scale}><mesh><octahedronGeometry args={[.55,0]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.7} roughness={.22} metalness={.45}/></mesh><mesh position={[0,-.35,0]} scale={[.65,.5,.65]}><coneGeometry args={[.48,.8,5]}/><meshStandardMaterial color="#1b2830" roughness={.8}/></mesh><pointLight color={color} intensity={2.4} distance={4}/></group>;
}
function CaveWorld({chamber,ambient}:{chamber:number;ambient:boolean}){
 const group=useRef<THREE.Group>(null); const color=palettes[chamber]||palettes[0];
 const rocks=useMemo(()=>Array.from({length:90},(_,i)=>({x:(Math.random()-.5)*24,y:(Math.random()-.5)*13,z:-Math.random()*28-2,s:.35+Math.random()*1.5,r:Math.random()*Math.PI})),[]);
 useFrame((state,delta)=>{if(group.current){group.current.rotation.y=THREE.MathUtils.damp(group.current.rotation.y,Math.sin(state.clock.elapsedTime*.12)*.035,2,delta);group.current.position.y= Math.sin(state.clock.elapsedTime*.35)*.08;}});
 return <group ref={group}>
  <fog attach="fog" args={["#07111c",7, thirty() ]}/>
  <ambientLight intensity={.48}/><directionalLight position={[4,8,4]} intensity={1.1} color="#a6d9e9"/><pointLight position={[0,1,-5]} color={color} intensity={5} distance={24}/>
  <mesh position={[0,-5,-13]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[60,60]}/><meshStandardMaterial color="#07131b" roughness={.28} metalness={.45}/></mesh>
  <mesh position={[0,8,-13]}><sphereGeometry args={[19,24,14,0,Math.PI*2,0,Math.PI*.48]}/><meshStandardMaterial color="#111d28" roughness={1} side={THREE.BackSide}/></mesh>
  {rocks.map((r,i)=><mesh key={i} position={[r.x,r.y+(r.y>0?3:-3),r.z]} rotation={[0,0,r.r]} scale={[r.s*.9,r.s*1.4,r.s]}><dodecahedronGeometry args={[1,0]}/><meshStandardMaterial color={i%3===0?"#1c303b":"#101d29"} roughness={.95}/></mesh>)}
  {Array.from({length:14},(_,i)=><Crystal key={i} position={[(i%2?1:-1)*(3.3+(i%4)*1.7),-3.7+(i%3)*.3,-3-i*1.65]} scale={.7+(i%4)*.24} color={i%3===0?"#d9b879":color} rotation={i*.7}/>)}
  {Array.from({length:11},(_,i)=><mesh key={`stal-${i}`} position={[(i-5)*2.1,6.2,-6-(i%3)*4]} rotation={[0,0,Math.PI]}><coneGeometry args={[.42+((i%3)*.12),2.4+(i%4)*.55,6]}/><meshStandardMaterial color="#1a2a34" roughness={1}/></mesh>)}
  <Sparkles count={ambient?90:160} scale={[23,12,30]} size={2.2} speed={.25} opacity={.65} color={color}/>
  <Stars radius={70} depth={45} count={ambient?500:850} factor={3} saturation={.25} fade speed={.3}/>
  <Float speed={.6} rotationIntensity={.1} floatIntensity={.25}><Crystal position={[0,1.1,-8]} scale={1.5} color={color}/></Float>
 </group>;
}
function thirty(){return 38;}
export default function CaveScene({chamber=0,ambient=false}:{chamber?:number;ambient?:boolean}){
 return <Canvas camera={{position:[0,1.1,7],fov:54}} dpr={[1,1.7]} gl={{antialias:true,alpha:false}}><color attach="background" args={["#050a11"]}/><CaveWorld chamber={chamber} ambient={ambient}/></Canvas>;
}
