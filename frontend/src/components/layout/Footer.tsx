import Image from "next/image"
import Link from "next/link"

type FooterProps = {
  className?: string
}

export const Footer = ({ className }: FooterProps) => {
  return (
    <footer
      className={`sticky bottom-0 space-x-2 flex justify-center items-center z-10 w-full h-12 bg-zinc-900 sm:h-14 sm:px-2 lg:px-6 lg:h-16 ${className}`}
    >
      <Link href="/">
        <Image
          src="/trello_clone_logo.svg"
          alt="Trello Clone"
          width={28}
          height={28}
          priority
        />
      </Link>
      <span className="hidden sm:inline text-white font-semibold sm:text-base lg:text-xl">
        Trello Clone
      </span>
    </footer>
  )
}
