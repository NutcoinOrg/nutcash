import { program } from 'commander';
import fs from 'fs';
import { parseBalanceMap } from '../src/parse-balance-map';
import path from 'path';
import { utils } from 'ethers'

const { getAddress } = utils

program
  .version('0.0.0')
  .requiredOption(
    '-i, --input <path>',
    'input JSON file location containing a map of account addresses to string balances'
  );

program.parse(process.argv);

// Read JSON input of airdrop distribution
const json = JSON.parse(fs.readFileSync(program.input, { encoding: 'utf8' }));

if (typeof json !== 'object') throw new Error('Invalid JSON');


// Write Merkle claims for all the eligible addresses except the ones holding NUT ecosystem assets
const excludedAdresses = ["0xa216aac062e52e2dad291396dbe4afb6d4e02b0a",
  "0x42476a4a7c7594c59329f6f4889d618a5327c12c",
  "0x05cd8937749729f3cca290ec1aa31b3e90e055dd",
  "0x9aa0c1e7cdcd1bbe6e5300debb28f377f4488b20",
  "0xc592ec9a511731c2f7b63918dde07d59a7d88247",
  "0xcbbbd46c9790b81c75a15c98d952d583eb260f06",
  "0xb9284335d9990666764cb737ed715f238fde69b4",
  "0xe80d45caf7f09b09b2c0b9c50a0ebdfc16051749",
  "0x238bc50696b76807b37e6877149acbe9023f2d6b",
  "0xa7441bfa3151534b4cf05b2b2f3da5befe613658",
  "0x8e04d5f3cd1ca6064ee52d21d86fe706a53c9bc9",
  "0x385f95dd38a97b7c191e94fbcb2040228629f364",
  "0x5b034da8b1b9f3a626a71af87fed24651a9dd48d",
  "0x846f723271b41ef52decd5b1b33f145c6c3e2e69",
  "0x78555980f8a10e7caa9d4c18c53576da25205e9e",
  "0xa2334655996faf43a767093d5ebc84a4f44a6718",
  "0xb31387161ae962dabf3ebb68ed790a34105bd8a0",
  "0x376fbe6d023db9e41e71a46fe409d791a9c0c7c1",
  "0xf4acf9264ff6687d1975bb1ffb56937a3e62ce89",
  "0x77c656b6c007dc0981865540c3a4b1348baa0b19",
  "0x2f08e24572271a8e3ccab887ebc0d9f9cafa29fa",
  "0x3f13e139b230c5dfef653a4d378c1515928daacb",
  "0x8675d6b071382c0b4625403fba167d0eb7354222",
  "0xdcd828e6ae3db6c864810b9d9d97d890c1e1cd0d",
  "0x57c5e759be85c2ecf519339e6829cc5b97954023",
  "0x5cd8e34d689d6681da6d680542b92490d7252fa5",
  "0x8495efdea8c9117983fea6b8cabe39badcdc64df",
  "0x2a9429b66e26881f9163b739a1a38dfc18b11fac",
  "0x057a455b14c12e1e975ce66a9e47f7ea23602fa9",
  "0x6f6aa6d036edde8d0c3406c250ffd1bb79348888",
  "0xcf96de8a4fb0005c98376c414cdbdd4a148cd0df",
  "0xa940dbfb2fb57c3d39898a937b3db48d732bb92d",
  "0xccfe7a0ca8207279cdc5b2f60f65ab5ff648f3da",
  "0x85ddc9a1d667ec539448f8a8a4123ccbdbd9f223",
  "0x6ba7ec76ff2b5b5c312b85e9fb62ef46db240567",
  "0x35de3b7f13a46689d9e0268d4737e22ebec26cc0",
  "0x7cafac7028d5f3de3418d31a70be0b98b8ed5a1b",
  "0xd4d85595f9c5792a5b3f03c8c7699f34f45b7b5f",
  "0x33d6bb3056c9393dbebc22e9122e791a8784024f",
  "0xb2b924a02a58ec6146b435b1870c56905b923298",
  "0x77f955e2af9dabd5981ed70fdb52dad9f0277d91",
  "0xeb2b6b0ccd926559be2a21ba7ce2b6754c46612e",
  "0x2743380a71d458ed604ab480a16e3a1557dd9777",
  "0x83837d12eb15933aa3f4b959f9edaf078f397ea5",
  "0x783efe9c9cda6398ca1443ac1ff57d74fed46a45",
  "0x8ac74078c9687c1ff238e64ace67544ae00e5e4d",
  "0x32ab2654c3cd9a510d0a2d583b61ae14722cabfb",
  "0x1b50075d391048fbb09668d3237f19c8305111b7",
  "0x7e31024b21d4fac0ca6240ca06f5af973b2ec491",
  "0x9f84a95aaa453e622a4aa06cbe8e4edbc5e9af64",
  "0xfabb1b96f69a1df5bb241fb57335b110d632cd18",
  "0xfa371a75c13945f38cb55ff54f07256182ec9019",
  "0x2464b553b419530bbc4b6b18bba75553eff051b3",
  "0x0e10b51faf4098ccd4257dbaf82b1c7ec1710e8b",
  "0x848f902f39e29778108f570ff74a83cf708eed71",
  "0x4608ba879c4b19bcb0aec3c2e5719989f6e75740",
  "0xe89868ebdbd53d04ae57ed8f576a9c6a72f1791f",
  "0x3b43956505196542757834c68d672e688f6ba48c",
  "0x8bc0f2ec868a5722f3315606614f57addf997083",
  "0x6ff7d2c162fc8c6c7286a4c73f93393cb7529d5e",
  "0xf2d16707a5f70414eccee91093980d5dc8216138",
  "0x75dc077d92aef1ef5458266431c262bedf4757a1",
  "0x64d81dec65feb82ebbf2fcff02ceef2e6ab1fa9a",
  "0x80556d5647ce7772224558d0de7b5e8c795d6f7b",
  "0x6bd58fccf92631d168a4635814ef6a1d8b9aaba7",
  "0xcb463b4c88b8a7ad8be00039f998057d209a838c",
  "0x1aa2d90064de3c421a9b45695e2fe1ac76fad889",
  "0x424ed4db047ff5848671f38b1eaf0794db34fe61",
  "0x77cfb359d73e8aed48e99201d894e03f2af48ac5",
  "0xd037cb3de0deefb59f944b3567f57d6f4b48974c",
  "0xe0ce668fcf04be32ba5022fd725756461a8a24e0",
  "0x75a64de4e172f058c07a68d8847445e1fcf8508e",
  "0xe55d6729f70edb25a4c3937f95f6949d5ae01f18",
  "0x3d8df90979254eefabae158a25da9ea36282cb9a",
  "0xf07c330ac68b94b7cb1b8d559550ea077fd0fbbe",
  "0xafdd6b8b4c7f824fb953862b9533a962e3354505",
  "0xb39f4e8ce9c307134992a91b97a43d56089cd0f4",
  "0x3375b336783fc369310c6dc07be7d0e349e43b65",
  "0x2ff2389ca5337cf98b2b0856025d7fae855873d4",
  "0xb69aaa73aa853768f4f6613be5b9024f6b845ba8",
  "0x3958024cce87c5d83a1d3704f8806ae7dc9c74cf",
  "0xb634d8fddc8fcd606f9fb78b077195841ff2756d",
  "0x4f82e73edb06d29ff62c91ec8f5ff06571bdeb29",
  "0x12197003cb5ccbcfc73db24370b37b010650d125",
  "0x0143862550a5cac7cd9995252068f2a2ce017b88",
  "0x73dd8f7d11a1d034ad563775eafdf97ae83e6773",
  "0x5a3d3008f77bad5180765a188d7c13c126c3ce04",
  "0x88cb427f4e5fe4315d15687ffa74a91d9619441e",
  "0x746f64083676bfdd403db8f63f931a50673ff279",
  "0x3a46f78f6d0a83081f7c612af922d8d0bfe4e3d0",
  "0x9492c9f7158bf0f1213bfaa4cceb6789e82cde08",
  "0xbdea4b975451a2def3b546775b8ee7a8a876bd8f",
  "0x6e6c4b83e6e17be35a9ee12b42be560539ddb8b6",
  "0x1ee561979f04ce207081bec60b3094c80bfcbfd1",
  "0x8c45ae8539c557923f96713d1bd5870c5cb0234e",
  "0xf674d20ad9d75fc8c7907dc8aa15cefe0984a931",
  "0x28578defe2f2655ed040cc74b8ac997a83dcb47f",
  "0x607c81195749d2ebd79ffea022a9c7214f08e7ed",
  "0x8bf60b5ad9ab2608349580e00d477146712ca03a",
  "0x5c73ad68bc12c96491f902c1545030d32f4cd70e",
  "0x566220e7eea98bd9c9fb71412a39abb9f71ac9d1",
  "0x7c18192491182395db00dad7f026f0c0a55ea3d0",
  "0x214ad919e9a7866ff85cf98631c339eda3671e11",
  "0xd907953d01c73f0dffb9a75555f37a3084ce8d02",
  "0xd36ef20d50f227651b79a72bc165b69a31a87c38",
  "0x4df6d61a1e5be3c36c892ee89391242c9cbb1ee4",
  "0xce9134a823997bbaba993970bdde006753bcc997",
  "0xaf1d0b2087f149784a50fdbfd5dbda16189c4d77",
  "0x28c5a733f7f6e6753f6d3f11f79d72e3ccfe8260",
  "0xc9a667f951bab05d3597c1dc6cd8ce4079f378bb",
  "0xd7b52e906d3186c1240bbad550d220e8d34e2e48",
  "0x9f364006176167a7706a8c7c8514c64e713552c5",
  "0x450034f82b401e83b255a8551936f08014364ae4",
  "0xc8b1b4b68f5a604fcb3079ae7b999dd2b656080f",
  "0x9fbf352ebbf627948d68ba0b45b8a5db4182f0c3",
  "0xc8c6ef5e50181c5c75c7784ae93113e8b3cdf886",
  "0xb46f1fb7f7726821e8942b7a2ccaf6a3a4308926",
  "0x7dd1f341e665afc7c0b0e17cd423ec0a2b795cc3",
  "0xfd1ba932155fa47ca0ff8dfd5decd92047c77c7f",
  "0x9fa9b74f05c84c9adab03db9e825c5fd435dbd74",
  "0x00c3348551f34450a7de1067d18f5e3da6565314",
  "0x9afa3336a319b8972052728640f4f5bbd00506ac",
  "0x81c99e968734bf0bf8b8aca6ad1b2dcb0c2c906f",
  "0xf7e6ef08edb452f223e7d6f33a32981f813d6a70",
  "0xab7d34c34951ea96a7373592ef5e9cbfe23163ac",
  "0x57d24b3abb86a45c6f572195b92687ba5a8b1cb3",
  "0xbeade3d2319e7b19b9ec957c0143a7eb3e59ab6d",
  "0xee07409aef4feb169cfa5356c2f8f099f4f0371d",
  "0x78e108ae1af7c01e602b2cad5d80f54d47cf37a8",
  "0xbba5348daaee3d3c66549f5a1ce394fd80584223",
  "0xf8e9403fbe497ce2652cc7240ad92742bac8d0fa",
  "0x2f7b302404d769121d624528573e315c3f620cd7",
  "0x04b64e84b113bc8e0cb8b05d79f64f71a668c921",
  "0xbe20cdce3956da505ce53b606c00beb27212aa3d",
  "0x1e230c702f383c474811f1db8f8a11ccc0859125",
  "0x3b79cce609e2eb6847d7f7c4e9914127f381b460",
  "0xeac3238d331a8e8e0e821a74c528ccd88a7ea948",
  "0xa445989492c6aeece4bb65243fee1265122fb3ba",
  "0x08c4e146e9e0935c627049cc21dfefbe9e384004",
  "0x7976831bfe43deabd67bb8d060ea29c51dabab33",
  "0xddaed03383a3edfb3ccee5434cbdb234a0d7daf6",
  "0xdd47280d82f6e54d83c2a2185e9f31890080a080",
  "0xce2dbe7e5a0b1862a20ead42c4a94b9cf6d1b4a6",
  "0x2cce5ea7a8327715e8450239a7c035c73af97ca9",
  "0x8ab2f276e76cae380e06c84ccae3c27b26e5d005",
  "0x2120d7e48e1b85050b5d99ecd2e051841a46d081",
  "0xe15f5a097eca5e71db406aadb3e0e8bf641ebc72",
  "0xc9ba9377c14a7fe160d900d00b53d28e16ef32bc",
  "0x64f60692ab24b3645f2b4fe6c5fd3e52a34ed4b6",
  "0x7d0c772df9e28d5f1d5e915a2f16285c97154a1e",
  "0xc0068548e9565489e34bbfeca367815075f00aae",
  "0xd4f69d02ef082f612558588d103994a7e3cf29c9",
  "0x69c0e470bb6b2235e58fa15165ea69251b123fc1",
  "0xc713fd01d182ba268fc4989fde652f7223451dc0",
  "0xf4d37c6dcad844913e98c4294f88d261b5066cf9",
  "0x5f1fc7b936135bd96071b96c52d65edbbd251ef0",
  "0xe2c326f08ab0d7a009fdb20ebf92e2596c6b3e59",
  "0x740dbc322c93adad12190e2bb3ac665cf3fc351f",
  "0x81c7889e9cbb15a5ef9cc319c7f14248cba4dbd1",
  "0xc141cf24fa3578307cba98eccdff7f6126c4036d",
  "0x07291bdbe5dd2f5c58355d84153d3adaf150215d",
  "0x987360a1c88ed913c00a4d97a0fc9595739920a0",
  "0x1378cdfb817cffc1de09724af51a1e4960013d59",
  "0x9a61d611a76fd1b9167037637e01d8df7398897d",
  "0x56219204eaec0a98bd168304aeee6a9162500d11",
  "0xfe5b434f2d641e71784850b1b6c9be523435dcd7",
  "0x18db6c536ba894f010f21966659fbe316ea93cba",
  "0xb6736d9bd67e3c4d13fa6bf05a04ab038f021867",
  "0x6ca32b6b3c60f813b16feaf9491dac3af132ca64",
  "0x059a4bddc08b078d459f2d681197c7b139494368",
  "0x200176e9192df8503836e5c4175012a1b539f19c",
  "0x84ed5b176fd6bf9e84dcda592f86b4c712f29f7b",
  "0x4516490a147169cf51f1771e5a4d3f1aac6da487",
  "0xb36ae17272b28e6257c54de3251417f5fead48e7",
  "0x9bc9db752e8a97a09bfa64d33a62b670b8bc0302",
  "0xe64dfe92895a87ae27362dbb79406d00a7f6b22e",
  "0x44d86c485a10adebfb8f55854f53f61f034ad47e",
  "0x2854749facdb677b4276108732961fb3c04f5e20",
  "0x77b016d956c5180e7c3ff522e5733a757745651d",
  "0x8df5b3e757005a13313e7d9e75d3c266fe1036a4",
  "0x97ac58483128c220a3c77bb63dbdafd353517178",
  "0x15c62100092ce39b93825313ccff2a7487ac3f07",
  "0x6ec9ad1af19dd788b70fe2d84a9be2053014ea5d",
  "0xb7ccf40fc66415798a00e9fcf4e2d5e93c8c3bc1",
  "0x1b14179a6a3a3c6eea3f1cdca9fd051cf206d5f5",
  "0x7d47005002ff05d6eb174aff2605d6623f1733ee",
  "0x0af2c2b3f1c0e7bdbc28c0f1a320806685c92dc4",
  "0xba060b8b7d605ef1072081219be4873c03bb78be",
  "0x24f68c53f66fee2ae08a7a931a3921d7ace6344f",
  "0x87f45d7b8398ba6d8567c64b7d13595d32cefd19",
  "0x27f4ca0d64289097b0e089264346cc36d65293f4",
  "0xc3c1ab595d94e7bb2ae647614330bd2d21789c26",
  "0x9705732f5e8eef4cd5abe8eaa21bdd2f30c31353",
  "0x4d5a515d213a2f921b4eae72d6fdd0e6b3f436d5",
  "0x68250ee2c53478802e97c30685330f3259aad806",
  "0xe0e74848a09cbf8a0eeefd19cfbf422793980df8",
  "0x51279d8fa6ac2d82428bc4b3a946650a938c2ca1",
  "0xbb0224e413340e8035510571937c62fe9ab79881",
  "0xa58094fce0949ae26d20dc7d8870180e5e3bb805",
  "0xb842dba3f662d43d9091f3049b208b3dca2b078e",
  "0x25dcc97f2faa3fb2e984ebd458b3c53ac6fa0b3f",
  "0xfed040f61fbe4427d72b89b838a67742445d645d",
  "0xf851a6bd2956b7101352ce5b41db3194ac0e7a32",
  "0x3ee7360a911f9fc01dd4ab7898990f7f63163f69",
  "0xe2bc49bad2f4376318b88c7fed519a950e9905a8",
  "0xe2b9a4ad91ad1a69151160691c1c8698fc0e49f8",
  "0xc7a4e96b6767f71f0205d008da0d0739b38c30e7",
  "0xa0847e6190120b33583fbc44000be3adae1c18aa",
  "0x0aa680ebaa9b4831c8c0b79a5d3ce664dff201db",
  "0xca6e9201ad1e3812299ba18941ee6e858c29284d",
  "0x03afff09b99332286d3e4813ede77c35adf6daf1",
  "0x8a3b5f082458828ed2b5d0dc4e38557c1b06ef07",
  "0x5c78b5e5cad7f4ab58a8cc7de18a092beddd92b6",
  "0xffaff54ed73affa9d05c9679f7a3ee0776b47a32",
  "0xc91c8451f480416f4a03a1f66b99507d9fed6010",
  "0x43555ce6cedb66c66faa1d9e5fc3e263a0a96b42",
  "0x45a256058da045a90e2f5c5049c41c7cad4afecf",
  "0xad2f2acee551974fa6251773047fca1ddbc51dfc",
  "0x294bdc5d8c33a9c790a9ec372bfab23ef40d2c8d",
  "0xdad6c68b13e336cfdc274f470258700938ba5808",
  "0xd1b8dfd730612790e49f116b6ea4884aca0085a7",
  "0x5e169a136ea366ec536f5b1ced542755d4af851f",
  "0xed4219cef6d2ec4e46de149247cb7f0648ea03e2",
  "0x66e8064c5f4d991db32d14ab9a9cca30caaf0fd7",
  "0x79c71d09fd01f7ec81b7a61ad2d36e61d4225be6",
  "0x089343c3bc57a2a24d60b5d6ef02d8b20b39403a",
  "0xb19dfb07d0f9305cab8d69d1a963f8d6afdf2302",
  "0xe480900e939fe9298c5ef54e085fbc8e495de10c",
  "0x7c1f7d2ab291377a56230343f713a999e428c514",
  "0x31447a8a30f5b1f4a6cdd6b76039f42208b7978b",
  "0x6dc170f6e72935beb42df841c4337d7be7990766",
  "0xd2cdccb04a159fb5a187120c63b3fbbc54491562",
  "0xecd92ad62788a2fc144425f859abd081ff080472",
  "0x962542769ba70cca8fda3da42af8e2a7962d6d1d",
  "0x80b544f5480d7e7c5f2845fcf328604b0990b648",
  "0xb369b7d7a4e8f99c7a255b4498313002c2265dc8",
  "0xe7ac4529acc76dba1317b66ad18ada0d84ea157a",
  "0xa18c6c18ea63b6183a4505578cb0f549bd352ed9",
  "0x249b87cb94f30a09b32a9ffd954e1492c9ed810f",
  "0x0a2db0fb99c7121723c40781e8fcb9fb5ce03db4",
  "0x2aa0da548b363a398ce18ac011d920e7bd730269",
  "0x5e6de5b3d7adc0c75b744c041a70363700f845dd",
  "0x658a05f7af5cc682778f97ca15676370b4afaebc",
  "0x26a59404703d0570943aede96b55d05e4b9173a5",
  "0xba2eda6e4bb6d99048081290462481d3f7f14c73",
  "0x1528cc9f60c22561d3d7f422f630ad1e89b686d5",
  "0xdb39b67655e6e8827f8e9e6eea338bdb4541ae40",
  "0x4dcc2eeb63750e9d3eb67a37bf1c205769dd99c0",
  "0x60c436681e9e39b348ae486bb977d348a11f1e47",
  "0xb817848f6f2fe861cb9b3be5f73e9cb7e2fefee6",
  "0xa240d4c9a99c51291181cfcd214179b13a1f9814",
  "0x2fbe86948b5ed9a784fb80dde48285db141f023b",
  "0xf0f876c34c12a6f3b322119ddcfcea7c7adc386b",
  "0x0ab9c86ceb71830ade0188b6e1ac5072b3b8a8b4",
  "0xb474aa06e2e19aae5b75d3659340d391598a699e",
  "0xf345160d0949c25be324831cb157043ce630b18a",
  "0x192cdd8d4a618580f2649818c3e5978afee810b2",
  "0x254c65ecca2dab1e1362d613deb0fa768ad5b294",
  "0x3fa87b6ee89b4e022ad6f1af3fb0456f1661a133",
  "0x68d02fcb92aa70914c048d01a8f1c651cbdc09cd",
  "0x8fa5387f7034398288f337738b3144a09df4ee70",
  "0x9d02b56ab12bab279e3e4a1325607389447356e3",
  "0xedc316b59ebceb09792acc5020f16790a394d6db",
  "0xf959c8af622fe60d3d7af7c6001e183a2c961f4a",
  "0x9174762be7d3f2e81d0803ad2314a2d0adc48d04",
  "0x672f2799c87fb702dd26ac666dea68f3138b22ca",
  "0x0b4c102d653a311a26f1219fbe2fe15d2e5df00b",
  "0x977c42f71158c63951e13f3aa93c42c6eea855f0",
  "0x5bd04b365ac5f64a96be017794286b5b9c1bb0fd",
  "0x94d3af948652ea2b272870ffa10da3250e0a34c4"
];


var result = parseBalanceMap(json);
console.log("Merkle Root: " + result.merkleRoot);
console.log("Token Total: " + result.tokenTotal);


const indexes: number[] = [];
const accounts: string[] = [];
const amounts: string[] = [];
const merkleProofs: string[][] = [];

// Create a set of normalized addresses to exclude for efficient lookup
const excludedAddressesSet = new Set(excludedAdresses.map((a) => getAddress(a)));

// Iterate over all claims and exclude the ones in excludedAdresses (size = 1,805,999 - 270 = 1,805,729)
for (const [address, claim] of Object.entries(result.claims)) {
  if (excludedAddressesSet.has(address)) {
    continue; // Skip this address
  }

  indexes.push(claim.index);
  accounts.push(address);
  amounts.push(claim.amount);
  merkleProofs.push(claim.proof);
}

/*
const reducedClaimsArgs = new Map<string, Object>();
reducedClaimsArgs.set('indexes', indexes);
reducedClaimsArgs.set('accounts', accounts);
reducedClaimsArgs.set('amounts', amounts);
reducedClaimsArgs.set('merkleProofs', merkleProofs);

const parseBalanceMapReduced = {
  merkleRoot: result.merkleRoot,
  tokenTotal: result.tokenTotal,
  claims: Object.fromEntries(reducedClaimsArgs),
};

const resultJSON = JSON.stringify(parseBalanceMapReduced, null, 2);
const dirname = path.resolve();
fs.writeFileSync(path.join(dirname, '../ncash-merkle-part2.json'), resultJSON); 
*/


const dirname = path.resolve();

// Write indexes
const indexesJSON = JSON.stringify(indexes, null, 2);
fs.writeFileSync(path.join(dirname, '../merkle-indexes-input-part2.json'), indexesJSON);


// Write accounts
const accountsJSON = JSON.stringify(accounts, null, 2);
fs.writeFileSync(path.join(dirname, '../merkle-accounts-input-part2.json'), accountsJSON);


// Write amounts
const amountsJSON = JSON.stringify(amounts, null, 2);
fs.writeFileSync(path.join(dirname, '../merkle-amounts-input-part2.json'), amountsJSON);


// Write merkleProofs using a write stream to handle large data
const merkleProofsPath = path.join(dirname, '../merkle-merkleProofs-input-part2.json');
const merkleProofsStream = fs.createWriteStream(merkleProofsPath);

// Start the JSON array
merkleProofsStream.write('[');

// Function to write the merkle proofs incrementally
function writeMerkleProofs(index: number) {
  if (index >= merkleProofs.length) {
    // End of data
    merkleProofsStream.write(']');
    merkleProofsStream.end();
    return;
  }

  const item = JSON.stringify(merkleProofs[index]);

  if (index > 0) {
    merkleProofsStream.write(',\n' + item);
  } else {
    merkleProofsStream.write('\n' + item);
  }

  // Use setImmediate to prevent blocking the event loop
  setImmediate(() => writeMerkleProofs(index + 1));
}

// Start writing the merkle proofs
writeMerkleProofs(0);