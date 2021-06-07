import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

import './styles.css'

function Home() {
  const history = useHistory()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    if (user.room) history.push('/leave')
    if (user.queue) history.push('/leave-queue')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="main-item">
        <h1>News</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ut
          auctor magna. Suspendisse metus justo, hendrerit in semper non,
          iaculis ac leo. Vivamus molestie sem aliquam magna pharetra tempus.
          Mauris diam nisi, convallis et dignissim nec, mollis nec nisl. Aliquam
          ac interdum erat, quis tincidunt magna. Suspendisse porttitor velit a
          hendrerit sodales. Integer sollicitudin accumsan ante a iaculis. Sed
          elementum velit malesuada neque pellentesque, eget porta nunc
          hendrerit. Donec at arcu tincidunt, tempor sem ac, lacinia ante. Proin
          in arcu in nisi condimentum posuere. Nulla tincidunt scelerisque mi
          non aliquam. Donec accumsan tristique sapien, in ultricies massa
          faucibus ac.
        </p>
        <br />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ut
          auctor magna. Suspendisse metus justo, hendrerit in semper non,
          iaculis ac leo. Vivamus molestie sem aliquam magna pharetra tempus.
          Mauris diam nisi, convallis et dignissim nec, mollis nec nisl. Aliquam
          ac interdum erat, quis tincidunt magna. Suspendisse porttitor velit a
          hendrerit sodales. Integer sollicitudin accumsan ante a iaculis. Sed
          elementum velit malesuada neque pellentesque, eget porta nunc
          hendrerit. Donec at arcu tincidunt, tempor sem ac, lacinia ante. Proin
          in arcu in nisi condimentum posuere. Nulla tincidunt scelerisque mi
          non aliquam. Donec accumsan tristique sapien, in ultricies massa
          faucibus ac.
        </p>
      </div>
    </>
  )
}

export default Home
