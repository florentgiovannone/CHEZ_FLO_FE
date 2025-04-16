import { IContent } from "../interfaces/content";

interface ContentProps {
    content: null | IContent;
    setContent: Function;
}

export default function GridGallery({ content }: ContentProps) {

    return (
        <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 m-5 mb-20">
                <div className="grid gap-4">
                    <div>
                        <img
                            className="h-auto max-w-full rounded-lg object-cover object-center"
                            src={`${content?.image_one}`}
                            alt="gallery-photo"
                        />
                    </div>
                    <div>
                        <img
                            className="h-auto max-w-full rounded-lg object-cover object-center "
                            src={`${content?.image_two}`}
                            alt="gallery-photo"
                        />
                    </div>
                    <div>
                        <img
                            className="h-auto max-w-full rounded-lg object-cover object-center"
                            src={`${content?.image_three}`}
                            alt="gallery-photo"
                        />
                    </div>
                </div>
                <div className="grid gap-4">
                    <div>
                        <img
                            className="h-auto max-w-full rounded-lg object-cover object-center"
                            src={`${content?.image_four}`}
                            alt="gallery-photo"
                        />
                    </div>
                    <div>
                        <img
                            className=" h-auto max-w-full rounded-lg object-cover object-center"
                            src={`${content?.image_five}`}
                            alt="gallery-photo"
                        />
                    </div>
                    <div>
                        <img
                            className="h-auto max-w-full rounded-lg object-cover object-center "
                            src={`${content?.image_six}`}
                            alt="gallery-photo"
                        />
                    </div>
                </div>
                <div className="grid gap-4">
                    <div>
                        <img
                            className="h-auto max-w-full rounded-lg object-cover object-center"
                            src={`${content?.image_three}`}
                            alt="gallery-photo"
                        />
                    </div>
                    <div>
                        <img
                            className="h-auto max-w-full rounded-lg object-cover object-center "
                            src={`${content?.image_six}`}
                            alt="gallery-photo"
                        />
                    </div>
                    <div>
                        <img
                            className="h-auto max-w-full rounded-lg object-cover object-center"
                            src={`${content?.image_four}`}
                            alt="gallery-photo"
                        />
                    </div>
                </div>
                <div className="grid gap-4">
                    <div>
                        <img
                            className="h-auto max-w-full rounded-lg object-cover object-center"
                            src={`${content?.image_four}`}
                            alt="gallery-photo"
                        />
                    </div>
                    <div>
                        <img
                            className="h-auto max-w-full rounded-lg object-cover object-center"
                            src={`${content?.image_two}`}
                            alt="gallery-photo"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}