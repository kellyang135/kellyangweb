// lib/useAnimationStore.ts
import { create } from 'zustand';
import * as THREE from 'three';

export type AnimationPhase = 'idle' | 'bursting' | 'transitioning' | 'open' | 'closing';

interface AnimationStore {
  // Mouse tracking
  mousePosition: THREE.Vector3;
  setMousePosition: (pos: THREE.Vector3) => void;

  // Animation phase
  phase: AnimationPhase;
  setPhase: (phase: AnimationPhase) => void;

  // Active atom info
  activeAtomPosition: THREE.Vector3 | null;
  activeAtomId: string | null;
  setActiveAtom: (id: string | null, position: THREE.Vector3 | null) => void;

  // Mobile detection
  isMobile: boolean;
  setIsMobile: (mobile: boolean) => void;

  // Burst trigger (timestamp for triggering effects)
  burstTimestamp: number;
  triggerBurst: () => void;
}

export const useAnimationStore = create<AnimationStore>((set) => ({
  mousePosition: new THREE.Vector3(0, 0, 0),
  setMousePosition: (pos) => set({ mousePosition: pos }),

  phase: 'idle',
  setPhase: (phase) => set({ phase }),

  activeAtomPosition: null,
  activeAtomId: null,
  setActiveAtom: (id, position) => set({ activeAtomId: id, activeAtomPosition: position }),

  isMobile: false,
  setIsMobile: (mobile) => set({ isMobile: mobile }),

  burstTimestamp: 0,
  triggerBurst: () => set({ burstTimestamp: Date.now() }),
}));
