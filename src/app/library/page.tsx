import Link from 'next/link';
import styles from './library.module.css';
import { Nav } from '@/components/Nav';

export default function LibraryPage() {
    return (
        <div className={styles.library}>
            <Nav />

            <main className={styles.content}>
                <div className={styles.empty}>
                    <span className={styles.emptyIcon}>📚</span>
                    <h2>Your Card Library</h2>
                    <p>Cards you create will appear here</p>
                    <Link href="/lab" className={styles.startBtn}>
                        Create Your First Card
                    </Link>
                </div>
            </main>
        </div>
    );
}
