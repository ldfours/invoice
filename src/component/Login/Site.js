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
            <div style={{ padding: "0px" }}
              className="flex-container">
              <img height={320} alt="elena business card" src="/images/elena-card.jpg" />
              <div style={{ marginLeft: "15px" }}>
                <div>
                  У Елены большой опыт работы с детьми всех возрастов и взрослыми.
                </div>
                <div>
                  Если вы чувствуете, что вашему ребенку необходима
                  логопедическая помощь, позвоните или пошлите электронное
                  сообщение, чтобы обсудить вашу проблему или назначить встречу:
                <div className="contact"> (416) 498-5006,
                  <span> </span>
                    <a href="mailto:ldfours@gmail.com">Ldfours@gmail.com</a>
                  </div>
                  <div style={{ margin: "10px" }}>
                    <address>
                      <em>32 Chardonnay Dr., Thornhill Woods, ON L4J&nbsp;8R8</em>
                    </address>
                    <img height={160}
                      alt="speech-success centre"
                      src="/images/speech-success.png" />
                    {/* <img alt="office address" src="/images/chardonnay-map.png" /> */}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <form className={styles.form} onSubmit={onSubmit}>
                <input className="login"
                  name="email"
                  value={email}
                  onChange={onChange}
                  autoComplete="username" />
                <span> </span>
                <input className="login"
                  name="password"
                  value={password}
                  onChange={onChange}
                  type='password'
                  autoComplete="current-password" />
                {isValid && <LoginIcon size={20} onClick={onSubmit} />}
              </form>
            </div>
          </article>
        </main>
      </section>
    </React.Fragment >
  )
}
