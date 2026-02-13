"use client";

import { useMemo } from "react";
import Atom from "./Atom";
import Bond from "./Bond";
import { atoms, bonds, AtomData } from "@/lib/crystalData";
import { bccPositions } from "@/lib/easterEgg";

interface LatticeProps {
  visibleAtomIds: string[];
  useBCC?: boolean;
}

const categoryColors: Record<AtomData["category"], string> = {
  core: "#4fd1c5",
  research: "#63b3ed",
  industry: "#f6ad55",
  project: "#68d391",
  education: "#b794f4",
};

export default function Lattice({ visibleAtomIds, useBCC = false }: LatticeProps) {
  const visibleAtoms = useMemo(
    () => atoms.filter((atom) => visibleAtomIds.includes(atom.id)),
    [visibleAtomIds]
  );

  const visibleBonds = useMemo(
    () =>
      bonds.filter(
        (bond) =>
          visibleAtomIds.includes(bond.from) && visibleAtomIds.includes(bond.to)
      ),
    [visibleAtomIds]
  );

  const atomPositions = useMemo(() => {
    const map: Record<string, [number, number, number]> = {};
    atoms.forEach((atom) => {
      map[atom.id] = useBCC && bccPositions[atom.id] ? bccPositions[atom.id] : atom.position;
    });
    return map;
  }, [useBCC]);

  return (
    <group>
      {visibleBonds.map((bond, i) => (
        <Bond
          key={`bond-${i}-${useBCC}`}
          start={atomPositions[bond.from]}
          end={atomPositions[bond.to]}
          opacity={0.15}
        />
      ))}
      {visibleAtoms.map((atom) => (
        <Atom
          key={`${atom.id}-${useBCC}`}
          position={atomPositions[atom.id]}
          size={atom.size}
          color={categoryColors[atom.category]}
          glowIntensity={atom.featured ? 0.7 : 0.4}
          pulseSpeed={atom.id === "kelly" ? 0.6 : 1.2}
        />
      ))}
    </group>
  );
}
