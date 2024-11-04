import React, { useState } from 'react';
import { Eye, MessageCircle, ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NewsGrid({ isHomePage = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const news = [
    {
      title: "Manfaat Luar Biasa Daun Kelor untuk Kesehatan",
      image: "/assets/images/Daun Kelor.webp",
      category: "Tanaman Herbal",
      slug: "Daun kelor terkenal karena kandungan antioksidannya yang tinggi dan dipercaya dapat membantu meningkatkan daya tahan tubuh serta mengurangi risiko penyakit kronis.",
      views: "2.1K",
      comments: 15,
      descrption: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro, consequatur quasi.Reprehenderit itaque rerum alias porro laboriosam nesciunt voluptas, assumenda optio iste! Facere dolore minus consequuntur dolores aperiam, commodi culpa ea id corrupti aspernatur quae, expedita nostrum architecto aliquam non perspiciatis reiciendis vitae labore eligendi tempore ipsum, pariatur neque laudantium accusantium. Cum quis atque repellendus quaerat doloremque, quae modi hic quibusdam, consectetur optio magni, voluptas quasi aliquam distinctio. Nisi consequatur officia nam, possimus beatae, libero eveniet odit dicta, dolores deleniti doloribus. Rem architecto enim cupiditate itaque totam suscipit! Voluptate atque tenetur consequatur eum quam dolorum dolorem, reprehenderit ipsa quia aliquam sequi. Ipsam possimus soluta voluptatem vitae consequatur mollitia laborum hic, rerum modi corrupti ullam. Libero a nihil sit eius quos veniam atque optio amet adipisci ducimus id animi eligendi vel possimus illo eos, corrupti perferendis odio at quas alias temporibus itaque? At eius doloremque iure nemo hic laudantium maiores voluptatibus vel fuga? A non consequuntur fugit necessitatibus facere. Aspernatur a assumenda et voluptatum asperiores cum amet illum quia quo explicabo eaque pariatur nesciunt sequi praesentium voluptates mollitia libero provident ipsa, iusto aliquid nihil! Qui, quidem eius aliquid aperiam necessitatibus quia hic repellendus. Sint dolor reiciendis dolores, nisi eius, ea odit eaque deleniti suscipit perferendis voluptate incidunt repellat ut laboriosam eos repudiandae iste harum et. Accusamus perspiciatis libero nisi nam ipsam nesciunt quaerat fuga quia animi minima commodi unde illo consequuntur eveniet excepturi accusantium nemo eum nostrum sint enim, deserunt laudantium voluptas velit aliquam. Distinctio quae minima ipsa iste dolore eum."

    },

    {
      title: "Rahasia Khasiat Temulawak sebagai Anti-inflamasi",
      image: "/assets/images/Daun Kelor.webp",
      category: "Tanaman Herbal",
      slug: "Temulawak adalah salah satu tanaman herbal yang memiliki manfaat anti-inflamasi, membantu mengurangi nyeri sendi, serta menjaga kesehatan pencernaan.",
      views: "1.8K",
      comments: 10,
      descrption: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro, consequatur quasi.Reprehenderit itaque rerum alias porro laboriosam nesciunt voluptas, assumenda optio iste! Facere dolore minus consequuntur dolores aperiam, commodi culpa ea id corrupti aspernatur quae, expedita nostrum architecto aliquam non perspiciatis reiciendis vitae labore eligendi tempore ipsum, pariatur neque laudantium accusantium. Cum quis atque repellendus quaerat doloremque, quae modi hic quibusdam, consectetur optio magni, voluptas quasi aliquam distinctio. Nisi consequatur officia nam, possimus beatae, libero eveniet odit dicta, dolores deleniti doloribus. Rem architecto enim cupiditate itaque totam suscipit! Voluptate atque tenetur consequatur eum quam dolorum dolorem, reprehenderit ipsa quia aliquam sequi. Ipsam possimus soluta voluptatem vitae consequatur mollitia laborum hic, rerum modi corrupti ullam. Libero a nihil sit eius quos veniam atque optio amet adipisci ducimus id animi eligendi vel possimus illo eos, corrupti perferendis odio at quas alias temporibus itaque? At eius doloremque iure nemo hic laudantium maiores voluptatibus vel fuga? A non consequuntur fugit necessitatibus facere. Aspernatur a assumenda et voluptatum asperiores cum amet illum quia quo explicabo eaque pariatur nesciunt sequi praesentium voluptates mollitia libero provident ipsa, iusto aliquid nihil! Qui, quidem eius aliquid aperiam necessitatibus quia hic repellendus. Sint dolor reiciendis dolores, nisi eius, ea odit eaque deleniti suscipit perferendis voluptate incidunt repellat ut laboriosam eos repudiandae iste harum et. Accusamus perspiciatis libero nisi nam ipsam nesciunt quaerat fuga quia animi minima commodi unde illo consequuntur eveniet excepturi accusantium nemo eum nostrum sint enim, deserunt laudantium voluptas velit aliquam. Distinctio quae minima ipsa iste dolore eum."

    },
    {
      title: "Jahe Merah: Tanaman Herbal Kaya Manfaat",
      image: "/assets/images/Daun Kelor.webp",
      category: "Tanaman Herbal",
      slug: "Jahe merah dikenal dengan khasiatnya yang mampu meredakan gejala masuk angin, meningkatkan sistem kekebalan tubuh, dan memperlancar peredaran darah.",
      views: "2.5K",
      comments: 18,
      descrption: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro, consequatur quasi.Reprehenderit itaque rerum alias porro laboriosam nesciunt voluptas, assumenda optio iste! Facere dolore minus consequuntur dolores aperiam, commodi culpa ea id corrupti aspernatur quae, expedita nostrum architecto aliquam non perspiciatis reiciendis vitae labore eligendi tempore ipsum, pariatur neque laudantium accusantium. Cum quis atque repellendus quaerat doloremque, quae modi hic quibusdam, consectetur optio magni, voluptas quasi aliquam distinctio. Nisi consequatur officia nam, possimus beatae, libero eveniet odit dicta, dolores deleniti doloribus. Rem architecto enim cupiditate itaque totam suscipit! Voluptate atque tenetur consequatur eum quam dolorum dolorem, reprehenderit ipsa quia aliquam sequi. Ipsam possimus soluta voluptatem vitae consequatur mollitia laborum hic, rerum modi corrupti ullam. Libero a nihil sit eius quos veniam atque optio amet adipisci ducimus id animi eligendi vel possimus illo eos, corrupti perferendis odio at quas alias temporibus itaque? At eius doloremque iure nemo hic laudantium maiores voluptatibus vel fuga? A non consequuntur fugit necessitatibus facere. Aspernatur a assumenda et voluptatum asperiores cum amet illum quia quo explicabo eaque pariatur nesciunt sequi praesentium voluptates mollitia libero provident ipsa, iusto aliquid nihil! Qui, quidem eius aliquid aperiam necessitatibus quia hic repellendus. Sint dolor reiciendis dolores, nisi eius, ea odit eaque deleniti suscipit perferendis voluptate incidunt repellat ut laboriosam eos repudiandae iste harum et. Accusamus perspiciatis libero nisi nam ipsam nesciunt quaerat fuga quia animi minima commodi unde illo consequuntur eveniet excepturi accusantium nemo eum nostrum sint enim, deserunt laudantium voluptas velit aliquam. Distinctio quae minima ipsa iste dolore eum."

    },
    {
      title: "Khasiat Kunyit untuk Kesehatan dan Kecantikan",
      image: "/assets/images/Daun Kelor.webp",
      category: "Tanaman ",
      slug: "Kunyit tidak hanya bermanfaat untuk meningkatkan sistem kekebalan tubuh, tetapi juga memiliki khasiat untuk menjaga kesehatan kulit dan kecantikan alami.",
      views: "2.3K",
      comments: 20,
      descrption: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro, consequatur quasi.Reprehenderit itaque rerum alias porro laboriosam nesciunt voluptas, assumenda optio iste! Facere dolore minus consequuntur dolores aperiam, commodi culpa ea id corrupti aspernatur quae, expedita nostrum architecto aliquam non perspiciatis reiciendis vitae labore eligendi tempore ipsum, pariatur neque laudantium accusantium. Cum quis atque repellendus quaerat doloremque, quae modi hic quibusdam, consectetur optio magni, voluptas quasi aliquam distinctio. Nisi consequatur officia nam, possimus beatae, libero eveniet odit dicta, dolores deleniti doloribus. Rem architecto enim cupiditate itaque totam suscipit! Voluptate atque tenetur consequatur eum quam dolorum dolorem, reprehenderit ipsa quia aliquam sequi. Ipsam possimus soluta voluptatem vitae consequatur mollitia laborum hic, rerum modi corrupti ullam. Libero a nihil sit eius quos veniam atque optio amet adipisci ducimus id animi eligendi vel possimus illo eos, corrupti perferendis odio at quas alias temporibus itaque? At eius doloremque iure nemo hic laudantium maiores voluptatibus vel fuga? A non consequuntur fugit necessitatibus facere. Aspernatur a assumenda et voluptatum asperiores cum amet illum quia quo explicabo eaque pariatur nesciunt sequi praesentium voluptates mollitia libero provident ipsa, iusto aliquid nihil! Qui, quidem eius aliquid aperiam necessitatibus quia hic repellendus. Sint dolor reiciendis dolores, nisi eius, ea odit eaque deleniti suscipit perferendis voluptate incidunt repellat ut laboriosam eos repudiandae iste harum et. Accusamus perspiciatis libero nisi nam ipsam nesciunt quaerat fuga quia animi minima commodi unde illo consequuntur eveniet excepturi accusantium nemo eum nostrum sint enim, deserunt laudantium voluptas velit aliquam. Distinctio quae minima ipsa iste dolore eum."

    },
  ];

  const categories = ['All', ...news.reduce<string[]>((acc, blog) => {
    if (!acc.includes(blog.category)) {
      acc.push(blog.category);
    }
    return acc;
  }, [])];

  const filterednews = news.filter(blog =>
    (selectedCategory === 'All' || blog.category === selectedCategory) &&
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displaynews = isHomePage ? filterednews.slice(0, 3) : filterednews;

  return (
    <div className="container mx-auto px-4">
      {!isHomePage && (
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Cari artikel..."
                className="w-full p-2 pl-10 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <select
              className="p-2 border rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displaynews.map((blog, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
            <img className="h-48 w-full object-cover" src={blog.image} alt={blog.title} />
            <div className="p-6">
              <div className="uppercase tracking-wide text-xs text-indigo-500 font-semibold">{blog.category}</div>
              <a href="#" className="block mt-2 text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-300">{blog.title}</a>
              <p className="mt-3 text-gray-500 text-sm">{blog.slug}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="flex items-center text-sm text-gray-500 mr-4">
                    <Eye size={16} className="mr-1" /> {blog.views}
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <MessageCircle size={16} className="mr-1" /> {blog.comments}
                  </span>
                </div>
                <Link to={`/artikel/${blog.title.toLowerCase().replace(/ /g, '-')}`} className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300 flex items-center">
                  Selengkapnya <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}