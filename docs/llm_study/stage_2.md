### Tokenization 将数据变为token

字符->token

先看
https://youtu.be/zduSFxRajkE?si=8WAIDPrK0tZP436j
这个大神的视频

#### 视频笔记
Unicode编码是一个字符集，包含了世界上所有的字符，每个字符都有一个唯一的编码点（code point）。在Python中，可以使用`ord()`函数将一个字符转换为它的Unicode编码点，返回一个整数。例如：

```python
ord('a')  # 输出: 97
```
但是按照这个来就太多了，我们使用UTF-8编码，它是一种变长的编码方式，可以用1到4个字节来表示一个Unicode字符。

UTF-8 还不错
UTF-16，32 会有很多0，浪费空间

BPE（Byte Pair Encoding）是一种常用的分词算法，主要用于自然语言处理中的文本预处理。它的基本思想是通过迭代地合并最频繁出现的字节对来构建一个词汇表，从而将文本分割成更小的单元（token）。BPE的步骤如下：
找寻出现最多的token 对，使用新的token替换，再继续找寻，直到vocab达到指定大小或是....

encode
decode 


OPENAI的Tokenizer
gpt2

256 raw tokens +50000 merge tokens + 1special tokens(<|endoftext|>) = 50257

### 数据预处理 清洗干净的数据
1.简单格式处理啥的
2.去重
MinHash算法
一种用于快速估计两个集合之间相似度的算法。它通过将集合中的元素映射到一个较小的空间中，并使用哈希函数来生成一个签名（signature），从而能够高效地比较两个集合的相似度。
步骤：
1. 定义一个哈希函数：选择一个适合的哈希函数，将集合中的元素映射到一个较小的空间中。通常使用多个哈希函数来生成多个签名。
2. 生成签名：对于每个集合，使用定义的哈希函数生成一个签名。签名是一个由哈希值组成的向量，表示集合中的元素在哈希空间中的位置。
3. 计算相似度：通过比较两个集合的签名，计算它们之间的相似度。常用的相似度度量方法是Jaccard相似度，它计算两个集合的交集与并集的比值。
```python
def minhash_signature(set, hash_functions):
    signature = []
    for hash_func in hash_functions:
        min_hash = float('inf')
        for element in set:
            hash_value = hash_func(element)
            if hash_value < min_hash:
                min_hash = hash_value
        signature.append(min_hash)
    return signature
def jaccard_similarity(signature1, signature2):
    intersection = sum(1 for a, b in zip(signature1, signature2) if a == b)
    union = len(signature1)  # Assuming both signatures have the same length
    return intersection / union if union > 0 else 0 
```
LSH算法
一种用于高效近似最近邻搜索的算法。它通过将数据点映射到一个较小的空间中，并使用哈希函数来生成一个签名（signature），从而能够快速地找到相似的数据点。
步骤：
1. 定义哈希函数：选择一个适合的哈希函数，将数据点映射到一个较小的空间中。通常使用多个哈希函数来生成多个签名。
2. 生成签名：对于每个数据点，使用定义的哈希函数生成一个签名。签名是一个由哈希值组成的向量，表示数据点在哈希空间中的位置。
3. 构建哈希表：将数据点的签名存储在一个哈希表中，以便快速查找。
4. 查询相似数据点：对于一个查询数据点，生成它的签名，并在哈希表中查找具有相似签名的数据点，从而找到近似的最近邻。
```python
def lsh_signature(data_point, hash_functions):
    signature = []
    for hash_func in hash_functions:
        hash_value = hash_func(data_point)
        signature.append(hash_value)
    return signature
def lsh_query(query_point, hash_table, hash_functions):
    query_signature = lsh_signature(query_point, hash_functions)    
    similar_points = []
    for bucket in hash_table.get(query_signature, []):
        similar_points.append(bucket)   
    return similar_points
```

3.高质量文本选择，分类器


### PEFT ,LoRA
PEFT（Parameter-Efficient Fine-Tuning）是一种用于微调预训练语言模型的方法，旨在通过调整模型的参数来适应特定任务，而不需要重新训练整个模型。PEFT的核心思想是通过引入一个小的适配器网络（adapter network）来调整预训练模型的输出，从而实现对特定任务的适应。

LORA（Low-Rank Adaptation）是一种PEFT方法，它通过引入一个低秩矩阵来调整预训练模型的输出，从而实现对特定任务的适应。LORA的核心思想是将预训练模型的输出表示为一个低秩矩阵的乘积，从而减少需要调整的参数数量，提高微调效率。