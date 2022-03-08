import styles from './Footer.module.css';
import { FaLinkedin, FaGithub } from 'react-icons/fa'

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <ul className={styles.social_icons}>
                <li><FaGithub /></li>
                <li><FaLinkedin /></li>
            </ul>

            <p className={styles.copyright}>
                <span>Costs</span> &copy; 2022 | Rafael de Oliveira
            </p>

        </footer>
    )
}

export default Footer