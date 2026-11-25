import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { animate, motion } from 'motion/react'

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen] as const
}

function Reveal({
  children,
  d = 0,
  as: Tag = 'div',
  className = '',
}: {
  children: ReactNode
  d?: number
  as?: 'div' | 'p' | 'h2' | 'li'
  className?: string
}) {
  const [ref, seen] = useInView<HTMLElement>(0.15)
  return (
    <Tag
      ref={ref as never}
      data-reveal
      className={`${className} ${seen ? 'in' : ''}`}
      style={{ '--d': d } as CSSProperties}
    >
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* data                                                                */
/* ------------------------------------------------------------------ */

type Piece = {
  pdf?: string
  src: string
  title: string
  note: string
  group: 'finance' | 'beyond'
}
const PIECES: Piece[] = [
  {
    src: '/vault/np-letter.jpg',
    pdf: '/national-program-confirmation.pdf',
    title: 'Official confirmation, National Program',
    note: 'Agency for Specialized Educational Institutions, 27 Oct 2026, No. SS-20-210',
    group: 'finance',
  },
  {
    src: '/vault/penn-finance.jpg',
    title: 'Fundamentals of Finance',
    note: 'University of Pennsylvania via Coursera, 29 Jun 2026',
    group: 'finance',
  },
  {
    src: '/vault/ielts.jpg',
    title: 'IELTS Academic 7.0',
    note: 'Listening 8.0, Reading 6.5, Writing 7.0, Speaking 7.0, CEFR C1. 3 Mar 2026',
    group: 'finance',
  },
  {
    src: '/vault/sat.jpg',
    title: 'SAT 1310',
    note: 'Math 700 (91st percentile), Reading and Writing 610. 3 Oct 2026',
    group: 'finance',
  },
  {
    src: '/vault/ai-leaders.jpg',
    title: 'Five Million AI Leaders',
    note: 'Prompt engineering for AI systems. Uzbekistan and UAE initiative, 19 Apr 2026',
    group: 'finance',
  },
  {
    src: '/vault/hackathon.jpg',
    title: 'Startup Saturday Hackathon',
    note: 'Outstanding startup model with team Dori Check. Presidential School in Gulistan',
    group: 'beyond',
  },
  {
    src: '/vault/zakovat.jpg',
    title: 'Zakovat, first place',
    note: 'Intellectual game, National Program Prezident iqtidorli farzandlari',
    group: 'beyond',
  },
  {
    src: '/vault/mun-honorable.jpg',
    title: 'Model UN, Honorable Mention',
    note: 'World Health Organization committee, GulPS MUN 26 x Elevate MUN, 4 April',
    group: 'beyond',
  },
  {
    src: '/vault/mun-appreciation.jpg',
    title: 'Model UN, Appreciation',
    note: 'Eloquence, analytical insight and debating skills in the WHO committee',
    group: 'beyond',
  },
  {
    src: '/vault/student-council.jpg',
    title: 'Student council coordinator',
    note: 'Education coordinator of the student council, School 4, Guliston. 25 May 2026',
    group: 'beyond',
  },
  {
    src: '/vault/talent-show.jpg',
    title: 'Best Performance',
    note: 'Talent Show, National Program Prezident iqtidorli farzandlari',
    group: 'beyond',
  },
  {
    src: '/vault/youth-seminar.jpg',
    title: 'Youth Affairs Agency seminar',
    note: 'Republic seminar on awareness and prevention among young people',
    group: 'beyond',
  },
]

/* ------------------------------------------------------------------ */
/* sections                                                            */
/* ------------------------------------------------------------------ */


/* ------------------------------------------------------------------ */
/* loader                                                              */
/* ------------------------------------------------------------------ */

function Loader({ onOpen, onGone }: { onOpen: () => void; onGone: () => void }) {
  const [n, setN] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ready = Promise.all([
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((r) => window.addEventListener('load', () => r(), { once: true })),
      document.fonts?.ready ?? Promise.resolve(),
    ])
    let cancelled = false
    const counter = animate(0, 100, {
      duration: reduce ? 0.4 : 2.8,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setN(Math.round(v)),
    })
    Promise.all([counter.finished, ready]).then(() => {
      if (cancelled) return
      setN(100)
      setTimeout(() => {
        setOpen(true)
        onOpen()
        setTimeout(onGone, 1800)
      }, 350)
    })
    return () => {
      cancelled = true
      counter.stop()
    }
  }, [onOpen, onGone])

  return (
    <div className={`loader ${open ? 'open' : ''}`} role="status" aria-live="polite" aria-label="Loading portfolio">
      <div className="door l" />
      <div className="door r" />
      <div className="stage">
        <div className="billload" aria-hidden="true">
          <img className="base" src="/vault/bill.jpg" alt="" />
          <img className="color" src="/vault/bill.jpg" alt="" style={{ clipPath: `inset(0 ${100 - n}% 0 0)` }} />
          <span className="scan" style={{ left: `${n}%` }} />
        </div>
        <div className="count">
          <span>$</span>
          <span>{n}</span>
          <small>{n < 100 ? 'counting it out' : 'every note counted'}</small>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* sections                                                            */
/* ------------------------------------------------------------------ */

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 120)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header className={`nav wrap ${scrolled ? 'scrolled' : ''}`}>
      <a className="mark" href="#top" aria-label="Javohir Ikromov, home">
        <i />
        Javohir Ikromov
      </a>
      <div className="navr">
      <nav aria-label="Sections">
        <ul>
          <li>
            <a href="#top">Work</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#story">Letter</a>
          </li>
          <li>
            <a href="#ledger">Record</a>
          </li>
          <li>
            <a href="#vault">Vault</a>
          </li>
        </ul>
      </nav>
      <a className="btn" href="#vault">
        See the vault
      </a>
      </div>
    </header>
  )
}


type Panel = {
  k: string
  kicker: string
  title: string
  text: string
  chip?: { label: string; href?: string }
}

const PANELS: Panel[] = [
  {
    k: 'finaris',
    kicker: 'Platform · founder',
    title: 'Finaris',
    text: 'A free practice-test platform for finance, mathematics, geometry and reasoning. I am the founder and front-end design lead. It took more than 25 weeks to build, and hundreds of students who struggle to pay for courses now use it for free.',
    chip: { label: 'finaris.uz', href: 'https://finaris.uz' },
  },
  {
    k: 'habits',
    kicker: 'Research · under review',
    title: 'Money habits',
    text: 'I surveyed 54 students who get money from their parents. 60% of those who often made unplanned purchases ran out of money, against 12.5% of those who rarely did. Setting goals without saving habits gave the same results as no goals. Co-written with an international business teacher, now under review for publication.',
    chip: { label: 'Under review' },
  },
  {
    k: 'sat',
    kicker: 'Mentoring · SAT Makon',
    title: 'SAT marathon',
    text: 'At the SAT Makon learning center I saw five students struggling; three commuted from a distant village, two could not afford the fees. I tested them, analyzed their mistakes, worked one-on-one, and asked each to teach the concept back to me.',
    chip: { label: 'Accuracy +20.2% in three lessons' },
  },
  {
    k: 'program',
    kicker: 'National program',
    title: '1 of 1,500',
    text: 'Chosen nationwide from about 30,000 applicants (about 5%) for the President’s Talented Children program. 60 hours of Accounting, Business and Global Perspectives modules at the Renessans camp, scored 96, 96 and 99. As the Agency’s letter states, they are not formal Cambridge AS or A Level qualifications.',
    chip: { label: 'Open the official letter', href: '/national-program-confirmation.pdf' },
  },
  {
    k: 'scores',
    kicker: 'Scores · March and October 2026',
    title: 'SAT 1,310 · IELTS 7.0',
    text: 'SAT: Math 700 (91st percentile), Reading and Writing 610, against a three-year average of 1043. IELTS Academic: Listening 8.0, Writing 7.0, Speaking 7.0, Reading 6.5, CEFR level C1.',
  },
  {
    k: 'doricheck',
    kicker: 'Startup · hackathon',
    title: 'DoriCHECK',
    text: 'I led the team that built and presented the DoriCHECK startup model at the Startup Saturday Hackathon, and we received a Certificate of Achievement for an outstanding model.',
    chip: { label: 'Certificate' },
  },
  {
    k: 'penn',
    kicker: 'Course · June 2026',
    title: 'Penn Finance',
    text: 'Completed Fundamentals of Finance, taught by Professor Jessica Wachter of the University of Pennsylvania, through Coursera.',
    chip: { label: 'Verify the certificate', href: 'https://coursera.org/verify/B2IQ06IFWFFE' },
  },
]

function Visual({ k }: { k: string }) {
  if (k === 'intro')
    return (
      <div className="pickup" role="img" aria-label="A spinning stack of one hundred dollar bills">
        <div className="bob">
          <div className="spin">
            {Array.from({ length: 11 }, (_, z) => (
              <img key={z} className="slab" src="/vault/bill.jpg" alt="" aria-hidden="true" style={{ '--z': z } as CSSProperties} />
            ))}
          </div>
        </div>
        <span className="ground" />
      </div>
    )
  if (k === 'finaris')
    return (
      <div className="vcard blue">
        <b>finaris.uz</b>
        <ul>
          <li>Finance</li>
          <li>Mathematics</li>
          <li>Geometry</li>
          <li>Reasoning</li>
        </ul>
        <span>Free realistic practice tests</span>
      </div>
    )
  if (k === 'habits')
    return (
      <div className="vdots">
        <div>
          <b>60%</b>
          <Dots value={60} fill="#d98d4a" />
          <span>often made unplanned purchases</span>
        </div>
        <div>
          <b>12.5%</b>
          <Dots value={12.5} fill="#b9c6e6" />
          <span>rarely did</span>
        </div>
      </div>
    )
  if (k === 'sat')
    return (
      <div className="vcard peri">
        <b>+20.2%</b>
        <span>average accuracy of five students after three lessons</span>
      </div>
    )
  if (k === 'program') return <img className="vimg tall" src="/vault/np-letter.jpg" alt="Official confirmation letter from the Agency for Specialized Educational Institutions" />
  if (k === 'scores')
    return (
      <div className="vpair">
        <img className="vimg" src="/vault/sat.jpg" alt="SAT score report, 1310" />
        <img className="vimg" src="/vault/ielts.jpg" alt="IELTS test report form, overall 7.0" />
      </div>
    )
  if (k === 'doricheck') return <img className="vimg" src="/vault/hackathon.jpg" alt="Startup Saturday Hackathon certificate of achievement" />
  return <img className="vimg" src="/vault/penn-finance.jpg" alt="Penn Fundamentals of Finance certificate" />
}

function Stage({ ready }: { ready: boolean }) {
  const keys = ['intro', ...PANELS.map((p) => p.k)]
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])
  return (
    <section className="split" id="top">
      <div className="stage" aria-hidden="true">
        <span className="tag">Selected work</span>
        {keys.map((k, i) => (
          <div key={k} className={`slide ${active === i ? 'on' : ''}`}>
            <Visual k={k} />
          </div>
        ))}
        <span className="cnt">{String(active).padStart(2, '0')}</span>
      </div>
      <div className="plist">
        <article className="panel intro" data-i={0} ref={(el) => { refs.current[0] = el }}>
          <h1 aria-label="Javohir Ikromov">
            {['Javohir', 'Ikromov'].map((w, wi) => (
              <span className="line" key={w} aria-hidden="true">
                {[...w].map((ch, i) => (
                  <motion.span
                    className="ch"
                    key={i}
                    initial={{ y: '112%' }}
                    animate={ready ? { y: '0%' } : { y: '112%' }}
                    transition={{ duration: 1, delay: 0.4 + (wi * 7 + i) * 0.045, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>
          <p className="lede">
            Finance applicant from Gulistan, Uzbekistan. I build things for students who cannot afford help, and I am
            applying to study finance. Class of 2027.
          </p>
          <div className="chips">
            <span>SAT 1,310</span>
            <span>IELTS 7.0</span>
            <span>1 of 1,500</span>
          </div>
          <div className="mv">
            <Visual k="intro" />
          </div>
        </article>
        {PANELS.map((p, n) => (
          <article
            className="panel"
            key={p.k}
            data-i={n + 1}
            ref={(el) => {
              refs.current[n + 1] = el
            }}
          >
            <small>{p.kicker}</small>
            <h2>{p.title}</h2>
            <p>{p.text}</p>
            {p.chip &&
              (p.chip.href ? (
                <a className="chip" href={p.chip.href} target="_blank" rel="noopener">
                  {p.chip.label}
                </a>
              ) : (
                <span className="chip">{p.chip.label}</span>
              ))}
            <div className="mv">
              <Visual k={p.k} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="sec dark about wrap" id="about">
      <Reveal as="h2" className="h2 wide">
        About me
      </Reveal>
      <div className="grid">
        <Reveal>
          <figure>
            <img src="/vault/portrait.jpg" alt="Javohir Ikromov holding a ginger kitten" loading="lazy" />
          </figure>
        </Reveal>
        <div className="words">
          <Reveal as="p" d={1}>
            I&rsquo;m from Gulistan, Uzbekistan. I joined an English class halfway through and came within eleven
            mistakes of losing my place, because I could not afford a tutor. Most of my classmates were gone by the end.
          </Reveal>
          <Reveal as="p" d={2}>
            So I built Finaris, a free practice platform, and studied how 54 students make their money last. I want to
            study finance to do this properly.
          </Reveal>
          <Reveal d={3}>
            <dl className="kv">
              <div>
                <dt>Based in</dt>
                <dd>Gulistan, Uzbekistan</dd>
              </div>
              <div>
                <dt>School</dt>
                <dd>Rustam Bosimov International School</dd>
              </div>
              <div>
                <dt>Graduating</dt>
                <dd>2027</dd>
              </div>
              <div>
                <dt>Languages</dt>
                <dd>Uzbek (native), English (IELTS 7.0, C1)</dd>
              </div>
              <div>
                <dt>Applying to</dt>
                <dd>BBA in Finance</dd>
              </div>
            </dl>
            <a className="btn" href="/national-program-confirmation.pdf" target="_blank" rel="noopener">
              Official letter (PDF)
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Story() {
  return (
    <section className="sec paper wrap" id="story">
      <div className="head2">
        <Reveal as="h2" className="h2">
          Letter from the founder
        </Reveal>
        <p className="statement">Three notes, each worth more than the last: a step from needing help to giving it.</p>
      </div>
      <div className="stack">
        <article className="leaf l1" style={{ '--i': 0 } as CSSProperties}>
          <div>
            <h3>Forty mistakes</h3>
            <p>
              That was all it would take to lose my place in an English class I had joined halfway through. I could not
              afford a tutor and was afraid to waste my teacher&rsquo;s time. I scored 71 out of 100, eleven mistakes
              from being out.
            </p>
            <span className="fact">Most of my classmates were gone by the end</span>
          </div>
          <div className="denom" data-d="$1" aria-hidden="true" />
        </article>
        <article className="leaf l2" style={{ '--i': 1 } as CSSProperties}>
          <div>
            <h3>Five students, three lessons</h3>
            <p>
              At the SAT Makon learning center I saw my younger self in five students. Three commuted from a distant
              village, two could not afford the fees. I tested them, analyzed their mistakes at home, worked one-on-one,
              and asked each to teach the concept back to me.
            </p>
            <span className="fact">Average accuracy +20.2%</span>
          </div>
          <div className="denom" data-d="$20" aria-hidden="true" />
        </article>
        <article className="leaf l3" style={{ '--i': 2 } as CSSProperties}>
          <div>
            <h3>Finaris</h3>
            <p>
              Two of them still left, because of money. So I founded finaris.uz, a free platform with realistic practice
              tests in finance, mathematics, geometry and reasoning. As founder and front-end design lead I built the
              interface and the testing modules. It took more than 25 weeks, and hundreds of students now use it.
            </p>
            <a className="fact" href="https://finaris.uz" target="_blank" rel="noopener">
              Visit finaris.uz
            </a>
          </div>
          <div className="denom" data-d="$100" aria-hidden="true" />
        </article>
      </div>
    </section>
  )
}

const LEDGER: [string, string][] = [
  ['Behavioral finance research', 'Co-wrote a study of 54 students on why some make their money last. I handled the technical background and the data. The paper is under review for publication.'],
  ['Finaris, founder', 'Front-end design lead of a free platform for realistic finance, math, geometry and reasoning tests at finaris.uz.'],
  ['SAT English mentoring', 'Tested five students, analyzed their errors and explained each one. Average accuracy up 20.2% after three lessons.'],
  ['Student council, Education Coordinator', 'Unanimously elected by staff and students. Organized daily study lessons and guided more than 800 students.'],
  ['President’s Talented Children', 'One of 1,500 chosen nationwide. Accounting 96, Business 96, Global Perspectives 99.'],
  ['DoriCHECK, Startup Saturday Hackathon', 'Led the team that built and presented the DoriCHECK startup model. Certificate of Achievement for an outstanding model.'],
  ['Banking internship', 'Seven days as assistant to a bank manager, learning how salaries, loans and transactions are calculated and managed. Certificate received.'],
  ['Wharton, Fundamentals of Finance', 'Completed the University of Pennsylvania course taught by Professor Jessica Wachter, verified on Coursera.'],
  ['Model United Nations', 'Delegate of North Korea in the WHO committee. Honorable Mention and Appreciation certificates for my speeches.'],
  ['Singing and guitar', 'Best Performance at the Talent Show of the President’s Talented Children program, as singer and guitarist.'],
]

function Ledger() {
  return (
    <section className="sec paper ledger" id="ledger">
      <div className="wrap">
        <Reveal as="h2" className="h2 wide">
          Ten things I did
        </Reveal>
      </div>
      <ul>
        {LEDGER.map(([t, d], i) => (
          <Reveal as="li" key={t} d={i % 3}>
            <h3>{t}</h3>
            <p>{d}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

function Dots({ value, fill }: { value: number; fill: string }) {
  const cells = Array.from({ length: 100 }, (_, i) => i)
  return (
    <div className="dots" aria-hidden="true">
      {cells.map((i) => {
        const full = i < Math.floor(value)
        const half = !full && i === Math.floor(value) && value % 1 > 0
        return (
          <span className="dot" key={i}>
            {(full || half) && (
              <i className={half ? 'half' : ''} style={{ '--n': i, '--fill': fill } as CSSProperties} />
            )}
          </span>
        )
      })}
    </div>
  )
}

function Vault() {
  const [filter, setFilter] = useState<'all' | 'finance' | 'beyond'>('all')
  const [open, setOpen] = useState<Piece | null>(null)
  const dlg = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = dlg.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  const tabs: [typeof filter, string][] = [
    ['all', 'Everything'],
    ['finance', 'Academics and tests'],
    ['beyond', 'Leadership and awards'],
  ]

  return (
    <section className="sec dark vault wrap" id="vault">
      <div className="top">
        <Reveal as="h2" className="h2">
          The vault
        </Reveal>
        <div className="filters" role="group" aria-label="Filter certificates">
          {tabs.map(([k, label]) => (
            <button key={k} aria-pressed={filter === k} onClick={() => setFilter(k)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="statement" style={{ marginTop: 24 }}>
        Every certificate, score report and official letter, as issued. Tap one to read it.
      </p>

      <div className="cols">
        {PIECES.map((p) => (
          <figure className="piece" key={p.src} hidden={filter !== 'all' && p.group !== filter}>
            <button onClick={() => setOpen(p)} aria-label={`Open ${p.title}`}>
              <img src={p.src} alt={`${p.title}`} loading="lazy" />
            </button>
            <figcaption>
              <b>{p.title}</b>
              <span>{p.note}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <dialog
        ref={dlg}
        className="lightbox"
        aria-label={open?.title ?? 'Certificate'}
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === dlg.current) setOpen(null)
        }}
      >
        {open && (
          <>
            <img src={open.src} alt={`${open.title}, full size`} />
            <p>
              {open.title}. {open.note}{' '}
              {open.pdf && (
                <a href={open.pdf} target="_blank" rel="noopener" style={{ color: '#c98a4a' }}>
                  Open the PDF
                </a>
              )}
            </p>
          </>
        )}
        <button className="close" onClick={() => setOpen(null)}>
          Close
        </button>
      </dialog>
    </section>
  )
}

function Apply() {
  return (
    <section className="sec paper apply" id="apply">
      <div className="wrap">
        <div className="head2">
          <Reveal as="h2" className="h2 wide">
            Why finance
          </Reveal>
          <p className="statement">
            Money, not ability, decided who stayed in my classroom. I want to understand why, and fix it.
          </p>
        </div>
        <div className="why three">
          <ul>
            <Reveal as="li">
              <b>Money shapes who gets to learn</b>
              I could not afford a tutor, and two of my students left a course because of fees. Finaris is my answer, and
              finance is how I want to scale it.
            </Reveal>
            <Reveal as="li" d={1}>
              <b>Habits matter more than the amount</b>
              In my study of 54 students, 60% of frequent unplanned spenders ran out of money, against 12.5% of the rest.
            </Reveal>
            <Reveal as="li" d={2}>
              <b>Research I want to keep doing</b>
              Investigating financial questions with experienced researchers and economists is both compelling and
              important to me.
            </Reveal>
          </ul>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="foot wrap">
      <div className="giant" aria-hidden="true">
        {['Javohir', 'Ikromov'].map((w, wi) => (
          <span className="word" key={w}>
            {[...w].map((ch, i) => (
              <span key={i}>{ch}</span>
            ))}
            {wi === 0 ? ' ' : ''}
          </span>
        ))}
      </div>
      <div className="meta">
        <p>
          Documents are issued under the spelling Javoxir Ikromov, the transliteration used on the IELTS, SAT and
          Coursera records. The official letter is dated 27 October 2026.
        </p>
        <p>
          <a href="/national-program-confirmation.pdf" target="_blank" rel="noopener">Official letter</a>
          {' · '}
          <a href="https://coursera.org/verify/B2IQ06IFWFFE" target="_blank" rel="noopener">Verify Penn certificate</a>
          {' · '}
          <a href="https://finaris.uz" target="_blank" rel="noopener">Finaris</a>
          {' · '}
          <a href="#top">Back to the top</a>
        </p>
      </div>
    </footer>
  )
}

export default function App() {
  const skip = useMemo(
    () => location.search.includes('noloader') || (navigator.webdriver === true && !location.search.includes('loader')),
    [],
  )
  const [loading, setLoading] = useState(!skip)
  const [ready, setReady] = useState(skip)

  // always begin at the top: no restored scroll position, no hash jump
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  // hard scroll lock while loading: wheel, touch and keys cannot move the page behind the loader
  useEffect(() => {
    const root = document.documentElement
    if (!loading) {
      root.classList.remove('locked')
      window.scrollTo(0, 0)
      return
    }
    root.classList.add('locked')
    window.scrollTo(0, 0)
    const stop = (e: Event) => e.preventDefault()
    const keys = (e: KeyboardEvent) => {
      if ([' ', 'PageDown', 'PageUp', 'End', 'Home', 'ArrowDown', 'ArrowUp'].includes(e.key)) e.preventDefault()
    }
    window.addEventListener('wheel', stop, { passive: false })
    window.addEventListener('touchmove', stop, { passive: false })
    window.addEventListener('keydown', keys)
    return () => {
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchmove', stop)
      window.removeEventListener('keydown', keys)
    }
  }, [loading])

  useEffect(() => {
    if (ready) document.documentElement.classList.add('loaded')
  }, [ready])

  return (
    <>
      {loading && <Loader onOpen={() => setReady(true)} onGone={() => setLoading(false)} />}
      <Nav />
      <main>
        <Stage ready={ready} />
        <About />
        <Story />
        <Ledger />
        <Vault />
        <Apply />
      </main>
      <Footer />
    </>
  )
}
