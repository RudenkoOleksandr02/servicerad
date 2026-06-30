import axios from 'axios'

const url = 'https://directus-production-2d7e.up.railway.app';
const instance = axios.create({
    baseURL: `${url}/graphql`,
    headers: {'content-type': 'application/json'}
})

const categoriesQL = `
    query getCategories {
      categories {
        id
        name_in_english
        name
        image {
            id
        }
        meta_keys
        meta_description
      }
    }
`;

export const categoriesAPI = () => {
    return instance.post('', {query: categoriesQL})
        .then(response => {
            return response.data.data.categories.map(category => {
                return {
                    id: category.id,
                    name: category.name,
                    link: category["name_in_english"],
                    image: url + '/' + 'assets' + '/' + category.image.id,
                    meta_keys: category.meta_keys,
                    meta_description: category.meta_description
                }
            })
        })
}
const productsQL = (link) => {
    return `
        query getCategoriesProducts {
          categories(filter: {
            name_in_english: {
              _eq: "${link}"
            }
          }) {
            name
            products {
              products_id {
                id
                title
                characteristics {
                    characteristics_id {
                        id
                        characteristic
                        data
                    }
                }
                image {
                  id
                }
              }
            }
          }
    }`
}

export const productsAPI = (link) => {
    return instance.post('', {query: productsQL(link)})
        .then(response => {
            const categoryName = response.data.data.categories[0].name

            const products = response.data.data.categories[0].products.map((el => {
                const product = el["products_id"]
                const description = product.characteristics.map(el => {
                    const data = el["characteristics_id"]

                    return {
                        ...data
                    }
                })

                return {
                    id: product.id,
                    title: product.title,
                    description: description,
                    image: url + '/' + 'assets' + '/' + product.image.id,
                }
            }))

            return {
                categoryName,
                products
            }
        })
}

const contactsQL = `
    query getContacts {
        contacts {
            phoneNumber1
            phoneNumber2
            email
            whatsapp
            telegram
            facebook
            instagram
            youtube
        }
    }
`

export const contactsAPI = () => {
    return instance.post('', {query: contactsQL})
        .then(response => {
            return response.data.data.contacts
        })
}

const faqQL = `
    query getFaq {
        faq {
            questions {
              questions_id {
                id
                question
                answer
              }
            }
        }
    }
`

export const faqAPI = () => {
    return instance.post('', {query: faqQL})
        .then(response => {
            return response.data.data.faq.questions.map(el => {
                const faq = el['questions_id']
                return {
                    id: faq.id,
                    question: faq.question,
                    answer: faq.answer
                }
            })
        })
}

const aboutQL = `
    query getAbout {
        about_us {
            content {
              blocks_id {
                id
                title
                text
                image {
                  id
                }
              }
            }
            partners {
              id
              directus_files_id {
                id
              }
            }
            reviews {
              id
              directus_files_id {
                id
              }
            }
            awards {
              id
              directus_files_id {
                id
              }
            }
        }
    }
`

export const aboutAPI = {
    getContentApi() {
        return instance.post('', {query: aboutQL})
            .then(response => {
                return response.data.data["about_us"].content.map(el => {
                    const content = el["blocks_id"]

                    return {
                        id: content.id,
                        title: content.title,
                        text: content.text,
                        image: url + '/' + 'assets' + '/' + content.image.id
                    }
                })
            })
    },
    getPartnersApi() {
        return instance.post('', {query: aboutQL})
            .then(response => {
                return response.data.data["about_us"].partners.map(el => {
                    return {
                        id: el.id,
                        width: el['directus_files_id'].width,
                        height: el['directus_files_id'].height,
                        image: url + '/' + 'assets' + '/' + el['directus_files_id'].id
                    }
                })
            })
    },
    getReviewsApi() {
        return instance.post('', {query: aboutQL})
            .then(response => {
                return response.data.data["about_us"].reviews.map(el => {
                    return {
                        id: el.id,
                        image: url + '/' + 'assets' + '/' + el['directus_files_id'].id
                    }
                })
            })
    },
    getAwardsApi() {
        return instance.post('', {query: aboutQL})
            .then(response => {
                return response.data.data["about_us"].awards.map(el => {
                    return {
                        id: el.id,
                        image: url + '/' + 'assets' + '/' + el['directus_files_id'].id
                    }
                })
            })
    },
}

const servicesQL = `
    query getServices {
      services {
        id
        title
        pre_description
        small_description
        image {
            id
        }
        descriptions {
          descriptions_id {
            id
            title
            description
          }
        }
      }
    }
`

export const servicesAPI = () => {
    return instance.post('', {query: servicesQL})
        .then(response => {
            return response.data.data.services.map(el => {
                const descriptions = el.descriptions.map(el => {
                    const data = el["descriptions_id"]

                    return {
                        id: data.id,
                        title: data.title,
                        description: data.description
                    }
                })

                return {
                    id: el.id,
                    title: el.title,
                    pre_description: el["pre_description"],
                    small_description: el["small_description"],
                    image: url + '/' + 'assets' + '/' + el.image.id,
                    descriptions: descriptions
                }
            })
        })
}

const galleryQL = `
    query getGallery {
      gallery {
        images {
          id 
          directus_files_id {
            id
          }
        }
      }
    }
`

export const galleryAPI = () => {
    return instance.post('', {query: galleryQL})
        .then(response => {
            return response.data.data.gallery.images.map(el => {
                return {
                    id: el.id,
                    image: url + '/' + 'assets' + '/' + el["directus_files_id"].id
                }
            })
        })
}
