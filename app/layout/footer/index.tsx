import React from 'react'
import styles from "./footerComponent.module.css"
import Link from 'next/link'
import Image from 'next/image'
import Facebook from "../../../public/assets/facebook.svg"
import Instagram from "../../../public/assets/instagram.svg"
import Youtube from "../../../public/assets/youtube.svg"
import Twitter from "../../../public/assets/twitter-x.svg"
import API from '../../api/anilist'

async function Footer() {

    const data = await API.getReleasingThisWeek("ANIME")

    return (
        <footer id={styles.footer}>

            <section id={styles.info_container}>

                <div id={styles.social_links_container} className='display_flex_row'>

                    <Link id={styles.img_container} href="/">
                        <Image
                            src='/logo.png'
                            alt="Aniproject Site Logo"
                            fill
                            sizes='91px'
                        ></Image>
                    </Link>

                    <div id={styles.social_media_container}>

                        <ul className='display_flex_row'>
                            <li><Link href="#"><Facebook width={16} height={16} title="Facebook" /> <span>Facebook</span></Link></li>
                            <li><Link href="#"><Twitter width={16} height={16} title="Twitter" /> <span>Twitter</span></Link></li>
                            <li><Link href="#"><Instagram width={16} height={16} title="Instagram" /> <span>Instagram</span></Link></li>
                            <li><Link href="#"><Youtube width={16} height={16} title="YouTube" /> <span>YouTube</span></Link></li>
                        </ul>

                    </div>

                </div>

                <span id={styles.span_border1}></span>

                <div id={styles.nav_links_container}>
                    <div className={styles.list_container}>
                        <h5>Categories</h5>

                        <ul className={`${styles.grid_template} display_grid`}>
                            <li><Link href="/search?genre=[action]">Action</Link></li>
                            <li><Link href="/search?genre=[adventure]">Adventure</Link></li>
                            <li><Link href="/search?genre=[drama]">Drama</Link></li>
                            <li><Link href="/search?genre=[sci-fi]">Sci-fi</Link></li>
                            <li><Link href="/search?genre=[comedy]">Comedy</Link></li>
                            <li><Link href="/search?genre=[slice-of-life]">Slice of Life</Link></li>
                            <li><Link href="/search?genre=[mystery]">Mystery</Link></li>
                            <li><Link href="/search?genre=[supernatural]">Supernatural</Link></li>
                            <li><Link href="/search?genre=[romance]">Romance</Link></li>
                            <li><Link href="/search?genre=[sports]">Sports</Link></li>
                        </ul>

                    </div>

                    <div className={styles.list_container}>
                        <h5>Airing This Week</h5>

                        <ul className={`${styles.grid_template} display_grid`}>
                            {data != undefined && (
                                data.slice(0, 10).map((item, key: number) => (
                                    <li key={key}><Link href={`/media/${item.id}`}>{item.title.romaji}</Link></li>
                                )))
                            }
                        </ul>

                    </div>


                    <div className='display_flex_row'>

                        <span id={styles.span_border2}></span>

                        <div id={styles.div_custom_margin}>
                            <h5>About</h5>

                            <ul>
                                <li><Link href="" target='_blank'>This Project</Link></li>
                                <li><Link href="https://anilist.gitbook.io/anilist-apiv2-docs/" target='_blank'>AniList API</Link></li>
                                <li><Link href="https://docs.consumet.org/" target='_blank'>Consumet API</Link></li>
                                <li><Link href="https://github.com/ghoshRitesh12/aniwatch-api" target='_blank'>Aniwatch API</Link></li>
                                <li><Link href="https://preview.themeforest.net/item/vodi-video-wordpress-theme-for-movies-tv-shows/full_screen_preview/23738703" target='_blank'>Inspiration 1</Link></li>
                                <li><Link href="https://dribbble.com/shots/20333170-The-Trailers-Concept-Site-Part-2" target='_blank'>Inspiration 2</Link></li>
                            </ul>
                        </div>

                    </div>

                </div>

            </section>

            <section id={styles.copyright_section} className=''>

                <div className='center display_flex_row'>
                    <div>
                        <small>Copyright © 2024, AniProject. All Rights Reserved</small>
                    </div>

                    <div>
                        <Link href="#"><small>Privacy Police</small></Link>
                    </div>
                </div>

            </section>

        </footer>
    )
}

export default Footer
