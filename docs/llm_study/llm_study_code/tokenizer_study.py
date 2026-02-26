from tokenizers import Tokenizer
from tokenizers.models import BPE
from tokenizers.trainers import BpeTrainer
from tokenizers.pre_tokenizers import ByteLevel

# 1. 初始化一个空的 BPE 模型
tokenizer = Tokenizer(BPE())

# 2. 设置预分词器（ByteLevel 能处理所有字符，包括 Emoji）
tokenizer.pre_tokenizer = ByteLevel()

# 3. 设置训练器，设定词表大小（比如 5000）
trainer = BpeTrainer(vocab_size=5000, min_frequency=2, special_tokens=[
    "<s>", "<pad>", "</s>", "<unk>", "<mask>"
])

# 4. 开始训练
files = ["docs\llm_study\llm_study_code\input.txt"]
tokenizer.train(files, trainer)

# 5. 测试一下
output = tokenizer.encode("大模型技术是未来的生产力")
print(f"Token IDs: {output.ids}")
print(f"Tokens: {output.tokens}")

# 6. 保存
tokenizer.save("docs\llm_study\llm_study_code\my_tokenizer.json")