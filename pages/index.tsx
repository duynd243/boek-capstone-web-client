import Image from "next/image";
import { toast } from "react-hot-toast";

export default function Home() {
  return (
    <section>
      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-blue-600 p-8 md:p-12 lg:px-16 lg:py-24  relative rounded-lg shadow-lg overflow-hidden"> 
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-bold text-white md:text-3xl">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit
              </h2>
              <p className="hidden text-white/90 sm:mt-4 sm:block " >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et,
                egestas tempus tellus etiam sed. Quam a scelerisque amet
                ullamcorper eu enim et fermentum, augue. Aliquet amet volutpat
                quisque ut interdum tincidunt duis.
              </p>
              <div className="mt-4 md:mt-8">
                <button
                  onClick={() => toast.success("Hello world!")}               
                  className="inline-block rounded border border-white bg-white px-12 py-3 text-sm font-medium text-blue-500 transition hover:bg-transparent hover:text-white focus:outline-none focus:ring focus:ring-yellow-400 hover:rotate-180 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                >
                  Show Toast
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-1 lg:grid-cols-2">
            <Image
              width={600}
              height={400}
              alt="Student"
              src="https://images.unsplash.com/photo-1621274790572-7c32596bc67f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=654&q=80"
              //Hold the mouse to enlarge the image
              className="h-40 w-full object-cover sm:h-56 md:h-full rounded shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            />
            <Image
              width={600}
              height={400}
              alt="Student"
              src="https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
              className="h-40 w-full object-cover sm:h-56 md:h-full rounded shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </section>
  );
}