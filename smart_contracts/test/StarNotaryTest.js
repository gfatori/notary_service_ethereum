const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => { 
    const defaultAccount = accounts[0]
    let user1 = accounts[1]
    let user2 = accounts[2]
    let randomMaliciousUser = accounts[3]
    
    //let starId = 1
    let starPrice = web3.toWei(.01, "ether")
    let name = 'awesome star!'
    let starStory = "this star was bought for my wife's birthday"
    let ra = "1"
    let dec = "1"
    let mag = "1"

    beforeEach(async function() { 
        this.contract = await StarNotary.new({from: defaultAccount})
    })
    
    describe('can create a star', () => { 
        it('can create a star and get its name', async function () { 
            let bola = await this.contract.createStar(
            'barranco!',
            'my story',
            'right ascendancy 10 10 20',
            'descending 11 09 07',
            'mag_5', 
            {from: accounts[0]}
            )
            console.log(await this.contract._tokenToStarInfo)
            //assert.equal(starInfo[0], name)
            //console.log(starInfo)
            //console.log(starInfo[1])
            //console.log(starInfo[2])
            //console.log(starInfo[3])
            //console.log(starInfo[4])
            //assert.equal(await this.contract.tokenIdToStarInfo(1), 'awesome star!')
        })
    })

    // describe('buying and selling stars', () => { 

    //     beforeEach(async function () { 
    //         await this.contract.createStar('awesome star!',
    //         starStory,
    //         ra,
    //         dec,
    //         mag, 
    //         {from: user1}
    //         )
    //     })

    //     it('user1 can put up their star for sale', async function () { 
    //         assert.equal(await this.contract.ownerOf(starId), user1)
    //         await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            
    //         assert.equal(await this.contract.starsForSale(starId), starPrice)
    //     })

    //     describe('user2 can buy a star that was put up for sale', () => { 
    //         beforeEach(async function () { 
    //             await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
    //         })

    //         it('user2 is the owner of the star after they buy it', async function() { 
    //             await this.contract.buyStar(starId, {from: user2, value: starPrice, gasPrice: 0})
    //             assert.equal(await this.contract.ownerOf(starId), user2)
    //         })

    //         it('user2 ether balance changed correctly', async function () { 
    //             let overpaidAmount = web3.toWei(.05, 'ether')
    //             const balanceBeforeTransaction = web3.eth.getBalance(user2)
    //             await this.contract.buyStar(starId, {from: user2, value: overpaidAmount, gasPrice: 0})
    //             const balanceAfterTransaction = web3.eth.getBalance(user2)

    //             assert.equal(balanceBeforeTransaction.sub(balanceAfterTransaction), starPrice)
    //         })
    //     })
    // })
})