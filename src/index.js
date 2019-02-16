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
            <h1>usefulKeys</h1>
            <p>
              Keyboard events as values for React. Proposal for an alternative
              to event callback hook APIs.
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
              <code>{`const { asd } = usefulKeys({ asd: 'a+s+d' })`}</code>
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
                <span role="img">🤔</span> Cool, couldn't that deadlock?
              </p>
            </div>
            <p>You mean like:</p>
            <pre>
              <code>{`if (asd.down) setState(true) // forever?`}</code>
            </pre>
            <p>
              Good eye. It could, if it wasn't for this one small detail: while{' '}
              <code>pressed</code> returns <code>true</code> for as long as the
              rule matches, <code className="special">down</code> and{' '}
              <code className="special">up</code> are special and will only
              return <code>true</code> <mark>once</mark> which guarantees that
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
                <span role="img">🤔</span> What's wrong with event callbacks?
              </p>
            </div>
            <p>
              Callbacks work fine, but they can <em>feel wrong</em>.{' '}
            </p>
            <p>
              Conceptually, on every render my component wants to query the
              state of its world with fresh eyes and make decisions about what
              it should render. Callbacks are one way to subscribe to outside
              changes and in return ultimately influence the component or
              application state.
            </p>
            <p>
              Hooks as an abstraction allow us to push these kinds of external
              details to the periphery{' '}
              <em>(which also makes them very reusable, yay!)</em> keeping our
              render code noise free. It lets us pretend the component's world
              is much simpler than it really is.{' '}
            </p>
            <p>
              Proxying an event callback through a hook stops short of
              fulfilling its potential. It might be a good idea to build higher
              abstractions on top that expose the details that matter to our
              component as values{' '}
              <em>(where it makes sense! lower level hooks are totally ok)</em>.
            </p>
          </section>

          <section>
            <div className="bubble-wrapper">
              <p className="bubble">
                <span role="img">🤔</span> Sorry I asked. Is it production
                ready?
              </p>
            </div>
            <p>
              The{' '}
              <a href="https://github.com/mcernusca/useful-keys">
                reference implementation
              </a>{' '}
              is good enough to meet my needs for these small demos but it isn't
              yet feature-complete. If you're doing more than playing you might
              consider wrapping a more{' '}
              <a href="https://craig.is/killing/mice">mature</a>{' '}
              <a href="https://github.com/jaywcjlove/hotkeys">library</a> in a
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
                  <a href="https://github.com/mcernusca/useful-keys">
                    github/useful-keys
                  </a>
                </p>
              </li>
              <li>
                <p>
                  <span role="img">🏖️</span>{' '}
                  <a href="">codesandbox/playground</a> try it out
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
                  - is the original inspiration although in most cases you'd
                  want to use the callback API and not re-render your component
                  on every event. Use this, build higher abstractions on top. It
                  is brilliant.
                </p>
              </li>
              <li>
                <p>
                  <a href="https://twitter.com/dan_abramov">Dan Abramov</a>'s{' '}
                  <a href="https://twitter.com/dan_abramov/status/1058508853216755713">
                    debug UI thread on Twitter
                  </a>{' '}
                  - a lot to unpack there but notice we care about the value as
                  it changes, not the change event. Subtle but important
                  difference.
                </p>
              </li>
              <li>
                <p>
                  Graphics programming environments and game engines like Unity
                  expose APIs like{' '}
                  <a href="https://docs.unity3d.com/ScriptReference/Input.GetKeyDown.html">
                    Input.GetKeyDown
                  </a>{' '}
                  that represent the state of the keys at a particular frame.
                  This is easier to do in these environments because they're
                  re-rendering 60 times per second and it isn't entirely
                  applicable to React. I'm curating a list of resources on
                  immediate mode GUIs{' '}
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
