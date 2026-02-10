'use client';

import { useState, useMemo, useCallback } from 'react';
import styles from './styles.module.css';
import type { BlockProps } from '@/types/blocks';
import type { LoveQuizInput, LoveQuizOutput } from './schema';

interface Question {
    question: string;
    correct: string;
    options: string[];
}

export default function LoveQuizBlock({
    input = {} as LoveQuizInput,
    onComplete,
}: BlockProps<LoveQuizInput, LoveQuizOutput>) {
    const title = input?.title || 'How Well Do You Know Me?';
    const skin = input?.skin || 'romantic';
    const perfectMsg = input?.perfectMsg || 'You know me so well! 💕';
    const goodMsg = input?.goodMsg || 'Pretty close! We need more dates 😘';

    // Build questions array
    const questions: Question[] = useMemo(() => {
        const qs: Question[] = [];
        const qData = [
            { q: input?.q1, a: input?.q1a, b: input?.q1b, c: input?.q1c },
            { q: input?.q2, a: input?.q2a, b: input?.q2b, c: input?.q2c },
            { q: input?.q3, a: input?.q3a, b: input?.q3b, c: input?.q3c },
            { q: input?.q4, a: input?.q4a, b: input?.q4b, c: input?.q4c },
        ];

        const defaults = [
            { q: 'What is my favorite food?', a: 'Pizza', b: 'Sushi', c: 'Tacos' },
            { q: 'What is my dream vacation?', a: 'Paris', b: 'Tokyo', c: 'Maldives' },
            { q: 'What makes me laugh the most?', a: 'Dad jokes', b: 'Cat videos', c: 'Memes' },
            { q: 'My love language is...', a: 'Quality time', b: 'Gifts', c: 'Words' },
        ];

        for (let i = 0; i < 4; i++) {
            const d = defaults[i];
            const q = qData[i];
            const correct = q.a || d.a;
            const opts = [correct, q.b || d.b, q.c || d.c];
            // Shuffle options
            for (let j = opts.length - 1; j > 0; j--) {
                const k = Math.floor(Math.random() * (j + 1));
                [opts[j], opts[k]] = [opts[k], opts[j]];
            }
            qs.push({ question: q.q || d.q, correct, options: opts });
        }
        return qs;
    }, [input]);

    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [streak, setStreak] = useState(0);

    const handleAnswer = useCallback((answer: string) => {
        if (selected !== null) return;
        const correct = answer === questions[currentQ].correct;
        setSelected(answer);
        setIsCorrect(correct);

        if (correct) {
            setScore((s) => s + 1);
            setStreak((s) => s + 1);
        } else {
            setStreak(0);
        }

        setTimeout(() => {
            if (currentQ < questions.length - 1) {
                setCurrentQ((q) => q + 1);
                setSelected(null);
                setIsCorrect(null);
            } else {
                setShowResult(true);
            }
        }, 1200);
    }, [selected, currentQ, questions]);

    const finalScore = showResult ? score : 0;
    const isPerfect = finalScore === questions.length;

    const handleFinish = () => {
        onComplete?.({
            score: finalScore,
            total: questions.length,
            playedAt: new Date().toISOString(),
        });
    };

    return (
        <div className={styles.container} data-skin={skin}>
            {!showResult ? (
                <div className={styles.quizCard}>
                    {/* Progress */}
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                        />
                    </div>

                    <div className={styles.header}>
                        <span className={styles.qNum}>Q{currentQ + 1}/{questions.length}</span>
                        {streak > 1 && <span className={styles.streakBadge}>🔥 {streak} streak!</span>}
                    </div>

                    <h2 className={styles.question} key={currentQ}>
                        {questions[currentQ].question}
                    </h2>

                    <div className={styles.options}>
                        {questions[currentQ].options.map((opt, i) => {
                            let optClass = styles.option;
                            if (selected !== null) {
                                if (opt === questions[currentQ].correct) optClass += ` ${styles.correct}`;
                                else if (opt === selected) optClass += ` ${styles.wrong}`;
                            }

                            return (
                                <button
                                    key={`${currentQ}-${i}`}
                                    className={optClass}
                                    onClick={() => handleAnswer(opt)}
                                    disabled={selected !== null}
                                >
                                    <span className={styles.optLabel}>{String.fromCharCode(65 + i)}</span>
                                    <span>{opt}</span>
                                </button>
                            );
                        })}
                    </div>

                    {isCorrect !== null && (
                        <div className={`${styles.feedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}`}>
                            {isCorrect ? '🎉 Correct!' : '😅 Not quite!'}
                        </div>
                    )}
                </div>
            ) : (
                <div className={styles.resultCard}>
                    <div className={styles.scoreCircle}>
                        <span className={styles.scoreNum}>{finalScore}</span>
                        <span className={styles.scoreSlash}>/{questions.length}</span>
                    </div>

                    <h2 className={styles.resultTitle}>
                        {isPerfect ? '🏆 Perfect Score!' : finalScore >= 3 ? '🌟 Great Job!' : '💪 Nice Try!'}
                    </h2>

                    <p className={styles.resultMsg}>
                        {isPerfect ? perfectMsg : goodMsg}
                    </p>

                    <div className={styles.scoreStars}>
                        {[...Array(questions.length)].map((_, i) => (
                            <span key={i} className={i < finalScore ? styles.starFilled : styles.starEmpty}>
                                {i < finalScore ? '⭐' : '☆'}
                            </span>
                        ))}
                    </div>

                    <button className={styles.finishBtn} onClick={handleFinish}>
                        Continue ✨
                    </button>
                </div>
            )}
        </div>
    );
}
