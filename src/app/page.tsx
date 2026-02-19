import Image from "next/image";
import Link from "next/link";

const tasks = [
  {
    id: "۱",
    title: "تسک ۱: داشبورد DummyJSON",
    description:
      "ورود، داشبورد، لیست کاربران و محصولات با ساختار مبتنی بر Chakra UI و رابط فارسی.",
    href: "/task-1/login",
    buttonLabel: "مشاهده تسک ۱",
  },
  {
    id: "۲",
    title: "تسک ۲: بازی ها و فیلتر RAWG",
    description:
      "صفحه لیست بازی، فیلترهای کاربردی و صفحه جزئیات هر بازی با ساختار مستقل.",
    href: "/task-2",
    buttonLabel: "مشاهده تسک ۲",
  },
  {
    id: "۳",
    title: "تسک ۳: Dropdown Select پیشرفته",
    description:
      "کامپوننت مستقل با جستجو، چندانتخابی، گروه بندی، انتخاب همه/هیچ و مجازی سازی آیتم زیاد.",
    href: "/task-3",
    buttonLabel: "مشاهده تسک ۳",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f6fcf9] to-[#edf8f2] px-4 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="grid gap-6 px-6 py-8 md:grid-cols-[1.4fr_1fr] md:px-10 md:py-10">
            <div className="space-y-4">
              <p className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                پروژه ارزیابی همکاری فرانت اند
              </p>
              <h1 className="text-2xl font-bold leading-10 text-gray-900 md:text-4xl">
                چالش سه تسکی بهمن سبز
              </h1>
              <p className="max-w-2xl text-sm leading-8 text-gray-600 md:text-base">
                هر تسک با ساختار و مسیر مستقل پیاده سازی شده تا دقیقاً مطابق نیازمندی
                تست قابل بررسی باشد. طراحی سراسری RTL، فارسی و مبتنی بر رنگ برند
                لوگوی بهمن سبز انجام شده است.
              </p>
            </div>
            <div className="relative flex items-center justify-center rounded-2xl border border-emerald-100 bg-[#f8fffc] p-5">
              <Image
                src="/Logo.png"
                alt="لوگوی بهمن سبز"
                width={240}
                height={189}
                className="h-auto w-48 object-contain md:w-56"
                priority
              />
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {tasks.map((task) => (
            <article
              key={task.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <span className="mb-2 inline-flex size-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                {task.id}
              </span>
              <h2 className="mb-2 text-lg font-bold text-gray-900">{task.title}</h2>
              <p className="mb-5 text-sm leading-7 text-gray-600">{task.description}</p>
              <Link
                href={task.href}
                className="inline-flex items-center justify-center rounded-xl bg-[#41BA89] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#32956e]"
              >
                {task.buttonLabel}
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
