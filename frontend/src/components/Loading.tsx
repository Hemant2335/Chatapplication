import loadinggif from '../assets/loading.gif'

const Loading = () => {
  return (
    <div className=" fixed flex h-[100vh] w-screen top-0 left-0 justify-center items-center  z-10 bg-[rgba(34,34,34,0.5)]">
        <img src={loadinggif} alt="Loading..." />
    </div>
  )
}

export default Loading