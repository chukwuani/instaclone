import * as React from "react";
import Image from "next/image";
import useEmblaCarousel, {
	type EmblaCarouselType,
	type EmblaOptionsType,
} from "embla-carousel-react";
import AutoHeight from "embla-carousel-auto-height";

interface Props {
	posts: Array<string>;
	toggleLike: () => void;
	options?: EmblaOptionsType;
}

const PostContent = ({ posts, toggleLike, options }: Props) => {
	const autoheight = React.useRef(AutoHeight({ destroyHeight: "auto" }));
	const [emblaRef, emblaApi] = useEmblaCarousel(options, [autoheight.current]);

	const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true);
	const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true);

	const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);

	const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

	const handleKeyDown = React.useCallback(
		(event: React.KeyboardEvent<HTMLButtonElement>) => {
			if (event.key === "ArrowLeft") {
				scrollPrev();
			} else if (event.key === "ArrowRight") {
				scrollNext();
			}
		},
		[scrollNext, scrollPrev]
	);

	const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
		setPrevBtnDisabled(!emblaApi.canScrollPrev());
		setNextBtnDisabled(!emblaApi.canScrollNext());
	}, []);

	React.useEffect(() => {
		if (!emblaApi) return;

		onSelect(emblaApi);
		emblaApi.on("reInit", onSelect);
		emblaApi.on("select", onSelect);
	}, [emblaApi, onSelect]);

	return (
		<section className="overflow-hidden max-w-[470px] w-full h-auto flex relative">
			<section
				ref={emblaRef}
				className="w-full flex max-h-[470px] h-auto">
				<ul className="post-content">
					{posts.map((item, index) => (
						<li
							key={index}
							className="post-content-item">
							{item.endsWith("mp4") ? (
								<video
									src={item}
									width={470}
									height={"auto"}
									controls
								/>
							) : (
								<Image
									onDoubleClick={toggleLike}
									src={item}
									alt="post"
									priority={index === 0}
									width={470}
									height={470}
									quality={100}
								/>
							)}
						</li>
					))}
				</ul>
			</section>

			<button
				onKeyDown={handleKeyDown}
				disabled={prevBtnDisabled}
				onClick={scrollPrev}
				className="back-btn"
				aria-label="Go back">
				<span className="sr-only">Previous slide</span>
			</button>

			<button
				onKeyDown={handleKeyDown}
				disabled={nextBtnDisabled}
				onClick={scrollNext}
				className="next-btn"
				aria-label="See next">
				<span className="sr-only">Next slide</span>
			</button>
		</section>
	);
};

export default PostContent;

// <div
// 		aria-label="Product image carousel"
// 		className={cn("flex flex-col gap-2", className)}
// 		{...props}>
// 		<div
// 			ref={emblaRef}
// 			className="overflow-hidden">
// 			<div
// 				className="-ml-4 flex touch-pan-y"
// 				style={{
// 					backfaceVisibility: "hidden",
// 				}}>
// 				{images.map((image, index) => (
// 					<div
// 						className="relative aspect-square min-w-0 flex-full pl-4"
// 						key={index}>
// 						<Image
// 							aria-label={`Slide ${index + 1} of ${images.length}`}
// 							role="group"
// 							key={index}
// 							aria-roledescription="slide"
// 							src={image.url}
// 							alt={image.name}
// 							fill
// 							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
// 							className="object-cover"
// 							priority={index === 0}
// 						/>
// 					</div>
// 				))}
// 			</div>
// 		</div>
// 		{images.length > 1 ? (
// 			<div className="flex w-full items-center justify-center gap-2">
// 				<Button
// 					variant="outline"
// 					size="icon"
// 					className="mr-0.5 aspect-square h-7 w-7 rounded-none sm:mr-2 sm:h-8 sm:w-8"
// 					disabled={prevBtnDisabled}
// 					onClick={scrollPrev}>
// 					<Icons.chevronLeft
// 						className="h-3 w-3 sm:h-4 sm:w-4"
// 						aria-hidden="true"
// 					/>
// 					<span className="sr-only">Previous slide</span>
// 				</Button>
// 				{images.map((image, i) => (
// 					<Button
// 						key={i}
// 						variant="outline"
// 						size="icon"
// 						className={cn(
// 							"group relative aspect-square h-full w-full max-w-[100px] rounded-none shadow-sm hover:bg-transparent focus-visible:ring-foreground",
// 							i === selectedIndex && "ring-1 ring-foreground"
// 						)}
// 						onClick={() => scrollTo(i)}
// 						onKeyDown={handleKeyDown}>
// 						<div className="absolute inset-0 z-10 bg-zinc-950/20 group-hover:bg-zinc-950/40" />
// 						<Image
// 							src={image.url}
// 							alt={image.name}
// 							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
// 							fill
// 						/>
// 						<span className="sr-only">
// 							Slide {i + 1} of {images.length}
// 						</span>
// 					</Button>
// 				))}
// 				<Button
// 					variant="outline"
// 					size="icon"
// 					className="ml-0.5 aspect-square h-7 w-7 rounded-none sm:ml-2 sm:h-8 sm:w-8"
// 					disabled={nextBtnDisabled}
// 					onClick={scrollNext}>
// 					<Icons.chevronRight
// 						className="h-3 w-3 sm:h-4 sm:w-4"
// 						aria-hidden="true"
// 					/>
// 					<span className="sr-only">Next slide</span>
// 				</Button>
// 			</div>
// 		) : null}
// 	</div>;
