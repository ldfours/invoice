import React from 'react'
import './style.css'
import styles from './form.module.scss'
import { FiLogIn as LoginIcon } from "react-icons/fi"

export default (
  { onSubmit, onChange, email, password, isValid, error }
) => {
  error && console.log(error.message)
  return (
    <React.Fragment>
      <header>
        <div id="logo">
          <img src="/images/izay.png" alt="Elena Fours" />
          Elena&nbsp;Fours
          </div>
        <nav>
          <ul>
            <li>Speech-Language Pathologist</li>
            <li>
              <form className={styles.form} onSubmit={onSubmit}>
                <div>
                  <input style={{ width: 170 }}
                    name="email"
                    value={email}
                    onChange={onChange}
                    autoComplete="username" />
                  <span> </span>
                  <input style={{ width: 60 }}
                    name="password"
                    value={password}
                    onChange={onChange}
                    type='password'
                    autoComplete="current-password" />
                  {isValid && <LoginIcon size={20} onClick={onSubmit} />}
                </div>
              </form>
            </li>
          </ul>
        </nav>
      </header>
      <section id="pageContent">
        <main role="main">
          <article>
            <h3>
              Елена &mdash; зарегистрированный в Онтарио (
                <a href="http://www.caslpo.com/">CASLPO</a>,
                <span> </span>
              <a href="http://www.osla.on.ca/">OSLA</a>
              ) <strong>Логопед</strong>.
            </h3>
            <p>У Елены большой опыт работы с детьми всех возрастов и взрослыми.
              Если вы чувствуете, что вашему ребенку необходима
              логопедическая помощь, позвоните или пошлите электронное
              сообщение, чтобы обсудить вашу проблему или назначить встречу:
            <span className="contact"> (416) 498-5006,
              <span> </span>
                <a href="mailto:ldfours@gmail.com">Ldfours@gmail.com</a>
              </span>
            </p>
            <address>
              <em>32 Chardonnay Dr., Thornhill Woods, ON L4J&nbsp;8R8</em>
            </address>
            <div className="flex-container">
              <img height={320} alt="office address" src="/images/chardonnay-map.png" />
              <span> </span>
              <img height={320} alt="elena business card" src="/images/elena-card.jpg" />
            </div>
          </article>
        </main>
        <aside>
          <div><img height={160} alt="speech-success centre" src="/images/speech-success.png" /></div>
        </aside>
      </section>
      <footer></footer>
    </React.Fragment>
  )
}
