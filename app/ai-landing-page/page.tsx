
import React from 'react';
import Script from 'next/script';
import fs from 'fs';
import path from 'path';

export default function CodexLandingPage() {
    // SSR'da public içindeki saf HTML dosyasını oku
    const htmlFilePath = path.join(process.cwd(), 'public', 'matrix-demo', 'index.html');
    const rawHtml = fs.readFileSync(htmlFilePath, 'utf8');
    
    // Sadece body içeriğini al
    const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1] : rawHtml;

    return (
        <>
            <div className="codex-container">
                {/* Orijinal CSS dosyaları */}
                <link rel="stylesheet" href="/matrix-demo/23tnaqn8ikmnp.css" />
                <link rel="stylesheet" href="/matrix-demo/3445772jury6y.css" />
                <link rel="stylesheet" href="/matrix-demo/2cz95lbx4ufp-.css" />
                <link rel="stylesheet" href="/matrix-demo/23fky70g62fni.css" />
                <link rel="stylesheet" href="/matrix-demo/2sbytptrrrh6y.css" />
                <link rel="stylesheet" href="/matrix-demo/1c3l7ofa-vr4e.css" />
                <link rel="stylesheet" href="/matrix-demo/1kvjjz1x6tgww.css" />
                <link rel="stylesheet" href="/matrix-demo/3l0fumx68x--b.css" />
                <link rel="stylesheet" href="/matrix-demo/371m1wkroup7c.css" />
                <link rel="stylesheet" href="/matrix-demo/3k2g3v_uak-u1.css" />
                <link rel="stylesheet" href="/matrix-demo/15ldpy9e2u5gw.css" />
                <link rel="stylesheet" href="/matrix-demo/0x-5drfo4rixj.css" />
                <link rel="stylesheet" href="/matrix-demo/0iy4z_6llviv2.css" />
                <link rel="stylesheet" href="/matrix-demo/38cm2tkepwr00.css" />
                <link rel="stylesheet" href="/matrix-demo/09t9in8h8h9yd.css" />
                <link rel="stylesheet" href="/matrix-demo/0ifi67wxrbsaq.css" />
                <link rel="stylesheet" href="/matrix-demo/2_uro-h4j39cs.css" />
                <link rel="stylesheet" href="/matrix-demo/3joiz7zi61a_s.css" />
                <link rel="stylesheet" href="/matrix-demo/3u9xgevl828vu.css" />
                <link rel="stylesheet" href="/matrix-demo/3om74s_avintz.css" />
                <link rel="stylesheet" href="/matrix-demo/0ja1ygm1247x2.css" />
                <link rel="stylesheet" href="/matrix-demo/02qavatj933a5.css" />
                <link rel="stylesheet" href="/matrix-demo/0h-tu49j5vys7.css" />
                <link rel="stylesheet" href="/matrix-demo/0j6dvdpebovbg.css" />
                <link rel="stylesheet" href="/matrix-demo/3bdopauhhn_cb.css" />
                <link rel="stylesheet" href="/matrix-demo/0a73uk6y55u29.css" />
                <link rel="stylesheet" href="/matrix-demo/0vpmvteqf0--a.css" />
                <link rel="stylesheet" href="/matrix-demo/199w-v6wvp-zb.css" />
                <link rel="stylesheet" href="/matrix-demo/011mcu7n6v7o0.css" />
                <link rel="stylesheet" href="/matrix-demo/360bwgze7el5j.css" />
                <link rel="stylesheet" href="/matrix-demo/0whxqe136feku.css" />
                <link rel="stylesheet" href="/matrix-demo/0y9_y8-vlpmn1.css" />
                <link rel="stylesheet" href="/matrix-demo/1t64wpjnpyypp.css" />
                <link rel="stylesheet" href="/matrix-demo/2i3baeuj560v6.css" />
                <link rel="stylesheet" href="/matrix-demo/1x81ox1s98glr.css" />
                <link rel="stylesheet" href="/matrix-demo/1vsqvqpe0lwsi.css" />
                <link rel="stylesheet" href="/matrix-demo/3ws6s-63hssiy.css" />
                <link rel="stylesheet" href="/matrix-demo/1str9kb7mkyey.css" />
                <link rel="stylesheet" href="/matrix-demo/1qjwv7z8-yp6s.css" />
                
                {/* Google Sans Font Yükleme */}
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap" />

                {/* IdeaAI Minimalist Cursor-Grade Tasarım Sistemi */}
                <style dangerouslySetInnerHTML={{ __html: `
                    @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap');

                    /* 1. Font: Google Sans */
                    * {
                        font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
                    }

                    /* 2. Arka Plan: #fbfbfb */
                    html, body, #__next, .codex-container, main, .bg-background {
                        background-color: #fbfbfb !important;
                        background: #fbfbfb !important;
                    }

                    /* OpenAI inatçı video ve renklerini yok et */
                    video, [data-video-container], [data-video-container="true"] {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        height: 0 !important;
                    }
                    [style*="#efeefe"], [style*="background-color:light-dark"], [style*="light-dark"] {
                        background-color: transparent !important;
                        background: transparent !important;
                    }

                    /* 3. Tipografi: Derin, Otoriter & Minimalist */
                    :root {
                        --color-primary-100: #171717 !important;
                        --color-primary-80: #404040 !important;
                        --color-primary-60: #737373 !important;
                        --color-primary-solid-100: #171717 !important;
                        --color-foreground: #171717 !important;
                    }

                    h1, h2, h3, h4, [data-article-hero-copy-region="headline"] {
                        color: #171717 !important;
                        letter-spacing: -0.035em !important;
                        font-weight: 550 !important;
                    }

                    p, [data-article-hero-copy-region="subhead"], figcaption {
                        color: #525252 !important;
                        line-height: 1.6 !important;
                    }

                    /* 4. Main CTA: #f3f3f3 */
                    a[data-analytics="codex.ctas.download.windows"] {
                        background-color: #f3f3f3 !important;
                        color: #171717 !important;
                        font-weight: 500 !important;
                        border: 1px solid rgba(0, 0, 0, 0.08) !important;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02) !important;
                        transition: all 0.15s ease !important;
                    }
                    a[data-analytics="codex.ctas.download.windows"]:hover {
                        background-color: #eaeaea !important;
                        border-color: rgba(0, 0, 0, 0.14) !important;
                        transform: translateY(-1px) !important;
                    }

                    /* İkincil CTA: Şeffaf Çerçeveli */
                    a[data-analytics="codex_hero_try_on_web"] {
                        background-color: transparent !important;
                        color: #171717 !important;
                        border: 1px solid rgba(0, 0, 0, 0.12) !important;
                        font-weight: 500 !important;
                        transition: all 0.15s ease !important;
                    }
                    a[data-analytics="codex_hero_try_on_web"]:hover {
                        background-color: #f3f3f3 !important;
                    }

                    /* 5. Kartlar, Kutucuklar, Logo Kapsayıcısı ve Footer: #f1f1f1 */
                    footer, [data-footer-variant], 
                    .overflow-clip.rounded-\[24px\],
                    [data-card],
                    header button[id*="radix"] {
                        background-color: #f1f1f1 !important;
                        border: 1px solid rgba(0, 0, 0, 0.06) !important;
                    }

                    /* Ortadaki Logo Kutucuğu */
                    .overflow-clip.rounded-\[24px\] {
                        background-color: #f1f1f1 !important;
                        border: 1px solid rgba(0, 0, 0, 0.08) !important;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03) !important;
                    }

                    /* Partner Logoları: Asil Siyah */
                    .bg-primary-100 {
                        background-color: #171717 !important;
                    }
                    [role="group"] div[style*="mask-image"],
                    [role="group"] div[style*="-webkit-mask-image"] {
                        background-color: #171717 !important;
                    }
                    [role="img"] svg, svg path {
                        fill: #171717 !important;
                    }
                `}} />

                {/* Sayfa İçeriği - public/matrix-demo/index.html dosyasını düzenlediğinizde buraya yansır! */}
                <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
                
                {/* Orijinal JS dosyaları */}
                <Script src="/matrix-demo/42tiaadjn1077.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0k1wdccbzb157.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/2ggr5oe6m1htd.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0j58r-ra7oegc.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/turbopack-0m58kxyavr5mw.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/064oqbtq9t9mn.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/01wtxbqdnk7ie.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1-3gqgmdiesb5.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/2xmc54z8glsrm.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/2z-01tve6du6u.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0feqi7wrjk8-4.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0qyc2oj-oke-8.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/3jgwbgxntqwwr.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/2rp65jm7oj0hn.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/2du2fc78sta6r.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0-vezf443_2eq.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/22h8xinedftyi.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/28zi7p4n_defz.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/2tcps9yc3uass.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0snfhlf0aonm0.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/27am0wkazfxix.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/2tl-a2x1_ob93.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/2k3-jd_w5v3kc.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0wmp0-_3w2yp_.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1i7x6m0--3h1n.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/2bb3ajwp45teh.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1waul1yq_-_cj.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1ftdjhy0bsc7e.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1xc_eqnu6gng2.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/3-uucmx0sgz89.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/3ze-ydkmvf44x.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1kdl23jxxeh-2.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/3_cn6z84if19w.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0nkptvo1gujj6.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1skpjns9jf5yc.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/3i6-bpq6fvnep.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1cl79-awv56ar.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1pp5su7fnpr4c.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/339_7rhz-3nvl.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/19m4ybdpejve-.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1wuc96q24-c0v.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1_696ov5tqelw.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/28wq3z5w3b9ts.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0oso_852or9mb.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/087_6gma90f9n.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/2nfndo-7smc2c.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/3w3-_yl3cg3y0.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1pchya2cnhb4-.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/3qsw_4nhdwlyn.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/3gpqj5aj08dp9.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/049ujnj5vablx.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/180y2p_8zfiy_.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/30zbapxzio2ow.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1jhcl8mond989.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/2wbhes9h9w52b.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0mljnom4bmi60.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1u463yn3rieah.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/3pca3shjsiu_q.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/3zueomcw2qfq9.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/279czcyk8unho.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0dfpqjin6t4po.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0_nln-dfh2zd1.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1zh-4axgz_vnu.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1h2fm3n782_zl.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1zwfko1xw_p_2.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0may-55u184pq.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0axwgld4-d0mo.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0xd0r54jfp45_.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0atdqzco56ud-.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1bb_ab40u39f4.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/3fi-8eje8vu8g.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1qz-s019_a3ao.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0xxwzqgzfmvm9.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/28ru5mdy8a7iv.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1vtbz1u_zwlfd.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/2m09ijlm_6grz.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/3je7o7eu1vhwr.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/251wuxbh0o6c6.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/3-tv5pseew9et.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/20mjzix66j32z.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0mfy-g83oemjb.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/039sfodus91pk.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/08ycsj0xmi92x.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0vecu5r93k-b6.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1a43l2lhrwu30.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/2xpbk1v1cur5j.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1_35jeeuuzmz8.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/3dr9shaq6311u.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0trbzvqcuaerf.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/2q31jz50k0ycd.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/36-uzos2nn4nn.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0pdbl_cb2y3is.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1u7eaza6hu2c4.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0-3txo3k221fw.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0ariuo2o_psjp.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1lp26knvqrt6b.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/3a6jrjz_1qzvc.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/2wuz_jrqocjw9.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/15o33c4-nmvk3.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/2i2g2ac5aqcj1.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/1f-u8ia60-88e.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0c0hxoamwjsbw.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/3scvsdd37w8xj.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/2-0nqeu4h7c7n.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/3z1wmea92wb4_.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/script.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/15n71mzetf8_y.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/3q5-3y55ojpe5.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/2zek30linvzab.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/3o7fvefqsmdsh.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/3c-4x62s6vbnl.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/2yh17ve0_0rv6.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/0na1s__2pjtur.js" strategy="lazyOnload" />
                <Script src="/matrix-demo/28t-jm-8d64gs.js" strategy="lazyOnload" />
            </div>
        </>
    );
}

// Cache bust: 1791656291826