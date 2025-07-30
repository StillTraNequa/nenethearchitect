import React from 'react';
import { Helmet } from 'react-helmet';
import { Disclosure } from '@headlessui/react';
import Footer from '../components/Footer';
import howToMeasure from '../assets/how-to-measure.jpg';
import backgroundImg from '../assets/nails-bg.png'

const FAQ = () => {
    const faqs = [
        {
            question: 'General Order Info',
            answer: `Most of our sets are handmade to order. Please allow 3–5 business days for production. If a product is marked “on hand,” it ships faster.
      All sets come with a mini nail file, buffer, cuticle pusher, alcohol wipe, and adhesive tabs or glue if selected.`
        },
        {
            question: 'Shipping & Processing',
            answer: `Handmade sets ship in 5-7 business days. On-hand sets ship within 1–2 business days. All orders include tracking.`
        },
        {
            question: 'Refunds & Returns',
            answer: `Due to hygiene and the custom nature of our nails, all sales are final. Please be sure of your sizing before ordering.`
        },
        {
            question: 'How to Measure Your Nails',
            answer: `Use a flexible tape measure or place a piece of tape across the widest part of your nail. Mark the edges, then measure in millimeters.`,
            img: howToMeasure,
            imgAlt: "How to Measure Your Nails"
        },
        {
            question: 'Sizing Chart',
            answer: (
                <>
                    <table className="table-auto mt-4 w-full text-sm border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Size Name</th>
                                <th className="border p-2">Thumb</th>
                                <th className="border p-2">Index</th>
                                <th className="border p-2">Middle</th>
                                <th className="border p-2">Ring</th>
                                <th className="border p-2">Pinky</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border p-2">XS</td>
                                <td className="border p-2">14mm</td>
                                <td className="border p-2">11mm</td>
                                <td className="border p-2">12mm</td>
                                <td className="border p-2">11mm</td>
                                <td className="border p-2">9mm</td>
                            </tr>
                            <tr>
                                <td className="border p-2">S</td>
                                <td className="border p-2">15mm</td>
                                <td className="border p-2">12mm</td>
                                <td className="border p-2">13mm</td>
                                <td className="border p-2">12mm</td>
                                <td className="border p-2">9mm</td>
                            </tr>
                            <tr>
                                <td className="border p-2">M</td>
                                <td className="border p-2">16mm</td>
                                <td className="border p-2">13mm</td>
                                <td className="border p-2">14mm</td>
                                <td className="border p-2">13mm</td>
                                <td className="border p-2">10mm</td>
                            </tr>
                            <tr>
                                <td className="border p-2">L</td>
                                <td className="border p-2">17mm</td>
                                <td className="border p-2">14mm</td>
                                <td className="border p-2">15mm</td>
                                <td className="border p-2">14mm</td>
                                <td className="border p-2">11mm</td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="mt-2 italic text-sm">Don’t see your exact fit? Choose “Custom Sizing” and leave your measurements at checkout.</p>
                </>
            )
        },
    ];

    return (
        <>
            <div
                className="bg-cover bg-center min-h-[100vh]"
                style={{ backgroundImage: `url(${backgroundImg})` }}
            >
                <Helmet>
                    <title>FAQs – NeNe The Architect Nails</title>
                </Helmet>

                <h1 className="text-3xl font-bold mb-6 text-center pt-8">Frequently Asked Questions</h1>

                <div className="max-w-3xl mx-auto px-4 py-8 text-left">
                    <div className="space-y-4">
                        {faqs.map(({ question, answer, img, imgAlt }, idx) => (
                            <Disclosure key={idx}>
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-left text-lg font-semibold bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500">
                                            <span>{question}</span>
                                            <svg
                                                className={`w-5 h-5 transform ${open ? 'rotate-180' : ''}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-gray-700">
                                            {typeof answer === 'string' ? <p>{answer}</p> : answer}
                                            {img && (
                                                <img
                                                    src={img}
                                                    alt={imgAlt}
                                                    className="mt-4 rounded-lg shadow w-full max-w-md"
                                                />
                                            )}
                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>
                        ))}
                    </div>
                </div>

            </div>
            <Footer />
        </>
    );

};

export default FAQ;
