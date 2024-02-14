
export default function Home(data: {html: string}) {
  return (
    <div>
      <div
      dangerouslySetInnerHTML={{__html: data.html}}
    />
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOSTED_DOMAIN}/api/frame`);
  const html = await res.text();
  return { props: { html } }
}