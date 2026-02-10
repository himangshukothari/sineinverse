'use client';

import { useState, useMemo, useCallback } from 'react';
import styles from './styles.module.css';
import type { BlockProps } from '@/types/blocks';
import type { PhotoPuzzleInput, PhotoPuzzleOutput } from './schema';

// 3x3 grid of emojis — goal state
const GOAL = ['❤️', '💕', '🌹', '💎', '⭐', '🦋', '💜', '🔥', ''];

function shuffle(arr: string[]): string[] {
    const a = [...arr];
    // Fisher-Yates with solvability check
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    // Ensure solvable (even number of inversions for 3x3)
    let inversions = 0;
    const filtered = a.filter((x) => x !== '');
    for (let i = 0; i < filtered.length; i++) {
        for (let j = i + 1; j < filtered.length; j++) {
            if (GOAL.indexOf(filtered[i]) > GOAL.indexOf(filtered[j])) inversions++;
        }
    }
    if (inversions % 2 !== 0) [a[0], a[1]] = [a[1], a[0]]; // Fix parity
    return a;
}

export default function PhotoPuzzleBlock({
    input = {} as PhotoPuzzleInput,
    onComplete,
}: BlockProps<PhotoPuzzleInput, PhotoPuzzleOutput>) {
    const title = input?.title || 'Solve the Puzzle!';
    const winMessage = input?.winMessage || 'You solved it! 🎉';
    const skin = input?.skin || 'classic';

    const initialTiles = useMemo(() => shuffle(GOAL), []);
    const [tiles, setTiles] = useState(initialTiles);
    const [moves, setMoves] = useState(0);
    const [solved, setSolved] = useState(false);

    const isSolved = useCallback((t: string[]) => {
        return t.every((val, i) => val === GOAL[i]);
    }, []);

    const handleTileClick = (index: number) => {
        if (solved) return;
        const emptyIndex = tiles.indexOf('');
        if (emptyIndex === -1) return;

        // Check if adjacent (up/down/left/right)
        const row = Math.floor(index / 3);
        const col = index % 3;
        const emptyRow = Math.floor(emptyIndex / 3);
        const emptyCol = emptyIndex % 3;
        const isAdjacent = (Math.abs(row - emptyRow) + Math.abs(col - emptyCol)) === 1;

        if (!isAdjacent) return;

        const newTiles = [...tiles];
        [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
        setTiles(newTiles);
        setMoves((m) => m + 1);

        if (isSolved(newTiles)) {
            setSolved(true);
        }
    };

    const handleContinue = () => {
        onComplete?.({ solved: true, moves });
    };

    return (
        <div className={styles.container} data-skin={skin}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.moveCount}>Moves: {moves}</p>

            <div className={styles.grid}>
                {tiles.map((tile, i) => (
                    <button
                        key={i}
                        className={`${styles.tile} ${tile === '' ? styles.empty : ''} ${solved && tile !== '' ? styles.solvedTile : ''}`}
                        onClick={() => handleTileClick(i)}
                        disabled={tile === '' || solved}
                    >
                        {tile && <span className={styles.tileEmoji}>{tile}</span>}
                    </button>
                ))}
            </div>

            {solved && (
                <div className={styles.winArea}>
                    <p className={styles.winMsg}>{winMessage}</p>
                    <p className={styles.winMoves}>Solved in {moves} moves!</p>
                    <button className={styles.continueBtn} onClick={handleContinue}>
                        Continue ✨
                    </button>
                </div>
            )}
        </div>
    );
}
