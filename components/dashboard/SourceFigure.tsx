import Image from "next/image";
export function SourceFigure({
  name,
  title,
  description,
}: {
  name: string;
  title: string;
  description: string;
}) {
  return (
    <details className="source-figure">
      <summary>{title} · gambar asli notebook</summary>
      <figure>
        <Image
          className="source-image"
          src={`/notebook/${name}.png`}
          alt={description}
          width={1100}
          height={825}
          unoptimized
        />
        <figcaption>
          {description} Koordinat numerik tidak tersimpan dalam output notebook;
          gambar ini dipertahankan tanpa rekonstruksi.{" "}
          <a href={`/notebook/${name}.png`} target="_blank" rel="noreferrer">
            Buka ukuran penuh ↗
          </a>
        </figcaption>
      </figure>
    </details>
  );
}
