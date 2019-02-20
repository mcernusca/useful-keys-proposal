import React from 'react'
import ReactDOM from 'react-dom'

import ASDDemo from './demos/asd'
import GridDemo from './demos/grid'

import './reset.css'
import './styles.css'

function App() {
  return (
    <div className="split-layout">
      <aside>
        <GridDemo />
      </aside>
      <main>
        <div className="page">
          <section>
            <h1>useKeyState</h1>
            <p>
              Keyboard events as data for React. Proposal for an alternative to
              event callback hook APIs.
            </p>
          </section>
          <section>
            <div className="bubble-wrapper">
              <p className="bubble">
                <span role="img">🔑</span> What?
              </p>
            </div>
            <p>For example:</p>
            <pre>
              <code>{`const {asd} = useKeyState({asd:'a+s+d'})`}</code>
            </pre>
            <p>
              Pass it a map of hotkey rules and it hands back one of the same
              shape. The values are state objects with three boolean properties:{' '}
              <code>pressed</code>, <code className="special">down</code> and{' '}
              <code className="special">up</code>. Your component will re-render
              only when a rule starts or stops matching. Try it:
            </p>

            <ASDDemo />
          </section>

          <section>
            <div className="bubble-wrapper">
              <p className="bubble">
                <span role="img">🤔</span> Wait, couldn't that deadlock?
              </p>
            </div>
            <p>
              React is pretty good about not letting you shoot yourself in the
              foot; however:
            </p>
            <pre>
              <code>{`useEffect(() => {
  if(asd.down) setState(Math.random())
})`}</code>
            </pre>
            <p>
              would be an infinite loop if it wasn't for this one small detail:
              while <code>pressed</code> returns <code>true</code> for as long
              as the rule matches, <code className="special">down</code> and{' '}
              <code className="special">up</code> are special and will only
              return <code>true</code> <mark>once</mark> — this guarantees that
              they return <code>false</code> the next time the component
              re-renders.{' '}
              <mark>
                This is the equivalent of an event callback —{' '}
                <em>you read it, consider yourself notified.</em>
              </mark>
            </p>
            <p>
              In practice, this isn't a big deal as you can always capture the
              value if you need in more than one place.
            </p>
          </section>

          <section>
            <div className="bubble-wrapper">
              <p className="bubble">
                <span role="img">🤔</span> Why not just use event callbacks?
              </p>
            </div>
            <p>
              Callbacks are fine until you want to base your render logic on the
              state of the keyboard. This is an experiment to try to represent
              key events as state but still preserve the semantics of the key up
              and down events.
            </p>
            <p>
              Hooks allow us to push external details like callbacks to the
              periphery <em>(which also makes them very reusable, yay!)</em>{' '}
              keeping our render code noise free. It lets us pretend the
              component's world is much simpler than it really is.
            </p>
          </section>

          <section>
            <div className="bubble-wrapper">
              <p className="bubble">
                <span role="img">🤔</span>Where do I start?
              </p>
            </div>
            <p>
              The{' '}
              <a href="https://github.com/mcernusca/use-key-state">
                reference implementation
              </a>{' '}
              is self-contained and good enough to meet my needs for these small
              demos but it isn't yet feature-complete. If you're doing more than
              playing you might consider wrapping a library you trust in a
              similar hook.
            </p>
            <p>
              I'm mostly interested if this resonates.{' '}
              <a href="https://twitter.com/mcernusca">
                Let me know what you think
              </a>
              .
            </p>
          </section>

          <section>
            <p>Links:</p>
            <ul>
              <li>
                <p>
                  <span role="img">⭐</span>{' '}
                  <a href="https://github.com/mcernusca/use-key-state">
                    github/use-key-state
                  </a>
                </p>
              </li>
              <li>
                <p>
                  <span role="img">🏖️</span>{' '}
                  <a href="https://codesandbox.io/s/n4o5z6yk3l">
                    codesandbox/example
                  </a>{' '}
                  try it out
                </p>
              </li>
              <li>
                <p>
                  <span role="img">🏖️</span>{' '}
                  <a href="https://codesandbox.io/s/wypw3x7o5">
                    codesandbox/meta
                  </a>{' '}
                  this website
                </p>
              </li>
            </ul>
          </section>

          <section>
            <p>Inspiration and further reading:</p>
            <ul>
              <li>
                <p>
                  <a href="https://twitter.com/0xca0a">Paul Henschel</a>'s{' '}
                  <a href="https://github.com/react-spring/react-with-gesture">
                    useGesture
                  </a>{' '}
                  - is the original inspiration. Use this, it is really good.
                </p>
              </li>
              <li>
                <p>
                  <a href="https://twitter.com/dan_abramov">Dan Abramov</a>'s{' '}
                  <a href="https://twitter.com/dan_abramov/status/1058508853216755713">
                    debug UI thread on Twitter
                  </a>{' '}
                  - notice we care about the value as it changes, not the change
                  event. Subtle but important difference.
                </p>
              </li>
              <li>
                <p>
                  Game engines like Unity expose APIs like{' '}
                  <a href="https://docs.unity3d.com/ScriptReference/Input.GetKeyDown.html">
                    Input.GetKeyDown
                  </a>{' '}
                  that represent the state of the keys at a particular frame. I
                  have a channel about immediate mode GUIs{' '}
                  <a href="https://www.are.na/mihai-cernusca/immediate-mode-guis">
                    on are.na
                  </a>{' '}
                  if you'd like to learn more.
                </p>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
