const { ApolloServer } = require("apollo-server");
const dns = require("dns");
const service = require("./service");

const isDomainAvaliable = function(url) {
    return new Promise(function(resolve /*, reject*/) {
        dns.resolve(url, function(error) {
            if (error) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};

const typeDefs = `

    type Item {
        id: Int
        type: String
        description: String
    }

    type Domain {
        name: String
        extension: String
        checkout: String
        avaliable: Boolean
    }

    type Query {
        items (type: String): [Item]
    }

    input ItemInput {
        type: String
        description: String
    }

    type Mutation {
        saveItem(item: ItemInput): Item
        deleteItem(id: Int): Boolean
        generateDomains: [Domain]
        generateDomain(name: String): [Domain]
    }
`;

const resolvers = {
    Query: {
        async items(_, args) {
            const items = await service.getItemByType(args.type);
            return items;
        }
    },
    Mutation: {
        async saveItem(_, args) {
            const item = args.item;
            const [ newItem ] = await service.saveItem(item);
            return newItem;
        },
        async deleteItem(_, args) {
            const id = args.id;
            await service.deleteItem(id);
            return true;
        },
        async generateDomains() {
            const domains = [];
            const items = await service.getItems();
            for (const prefix of items.filter(item => item.type === "prefix")) {
                for (const suffix of items.filter(item => item.type === "suffix")) {
                    const name = prefix.description + suffix.description;
                    const url = name.toLowerCase();
                    const checkout = `https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=.com.br`;
                    const avaliable = await isDomainAvaliable(`${url}.com.br`);
                    domains.push({
                        name,
                        checkout,
                        avaliable
                    });
                }
            }
            return domains;
        },
        async generateDomain(_, args) {
            const name = args.name;
            const extensions = ".com .net .org .com.br .net.br .org.br".split(" ");
            const domains = [];
            for (const extension of extensions) {
                const url = name.toLowerCase();
                const checkout = `https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=${extension}`;
                const avaliable = await isDomainAvaliable(`${url}${extension}`);
                domains.push({
                    name,
                    extension,
                    checkout,
                    avaliable
                });
            }
            return domains;
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen();
